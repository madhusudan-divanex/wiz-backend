const cron = require('node-cron');
const mongoose = require('mongoose');
const BuyMembership = require('../models/buymembership.model'); // Adjust the path to your model
const Membership = require('../models/membership.model'); // Adjust the path to your model
const User = require('../models/user.model');
const ProviderAccreditation = require('../models/Provider/providerAccreditation.model');
const OpenDispute = require('../models/OpenDispute');
const safeUnlink = require('./globalFuntion');
const Advertisement = require('../models/Provider/providerAdvertisement.model');
const membershipModel = require('../models/membership.model');

cron.schedule('0 1 * * *', async () => {
  console.log('🔁 Cron Job Running: Checking expired memberships');

  const today = new Date();

  try {
    const result = await BuyMembership.updateMany(
      {
        endDate: { $lt: today },
        status: 'active' // Only update active ones
      },
      {
        $set: { status: 'expired' }
      }
    );
    const newDate = new Date(today);
    newDate.setHours(newDate.getHours() + 23);

    const nextResult = await BuyMembership.updateMany(
      {
        startDate: { $lte: newDate },
        endDate: { $gte: newDate },
        status: 'next' // Only update ones scheduled to start
      },
      {
        $set: { status: 'active' }
      }
    );


    console.log(`✅ Cron Job Complete: ${result.modifiedCount} memberships marked as expired.`);
    console.log(`✅ Cron Job Complete: ${nextResult.modifiedCount} memberships marked as active.`);
  } catch (error) {
    console.error('❌ Cron Job Error:', error);
  }
});



cron.schedule('0 0 * * *', async () => {
  console.log('Running trade license expiry check job...');

  try {
    const today = new Date();

    // Find all provider accreditations
    const accreditations = await ProviderAccreditation.find({licenseCurrentlyActive:true});

    for (const acc of accreditations) {
      if (!acc.licenses || acc.licenses.length === 0) continue;

      // Check if all licenses are expired
      const allExpired = acc.licenses.every(
        lic => lic.licenseExpiryDate && new Date(lic.licenseExpiryDate) < today
      );

      if (allExpired) {
        // Update user status to pending
        await User.findByIdAndUpdate(acc.userId, { status: 'tradedraft' });
        console.log(`User ${acc.userId} status updated to pending (all licenses expired).`);
      }
    }

    console.log('License expiry check job completed.');
  } catch (err) {
    console.error('Error running license check job:', err);
  }
});

async function deleteOldPendingDisputes() {
  try {
    const twelveHoursAgo = new Date(Date.now() - 1 * 60 * 60 * 1000);

    const disputesToDelete = await OpenDispute.find({
      status: 'payment-pending',
      createdAt: { $lt: twelveHoursAgo }
    });

    if (disputesToDelete.length > 0) {
      for (let dispute of disputesToDelete) {
        if (dispute.image) {
          await safeUnlink(dispute.image);
        }

        // Delete the dispute from the database
        await OpenDispute.deleteOne({ _id: dispute._id });
        console.log(`Deleted dispute with ID: ${dispute._id}`);
      }
    } else {
      console.log('No disputes found that are older than 12 hours and payment-pending.');
    }
  } catch (err) {
    console.error("Error during dispute deletion:", err);
  }
}

// Set up a cron job to run every hour (adjust the schedule as needed)
cron.schedule('0 * * * *', () => {
  console.log("Running scheduled job to delete old payment-pending disputes...");
  deleteOldPendingDisputes();
});


// Run every day at 00:00 (midnight)
cron.schedule('0 0 * * *', async () => {
  try {
    console.log("📌 Ads status cron started:", new Date());

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    // 1. APPROVED → LIVE when startDate == today
    const liveUpdated = await Advertisement.updateMany(
      {
        status: "approve",
        startDate: { $gte: today, $lt: tomorrow }
      },
      { $set: { status: "live" } }
    );

    // 2. LIVE → EXPIRED when endDate < today
    const expiredUpdated = await Advertisement.updateMany(
      {
        status: "live",
        endDate: { $lt: today }
      },
      { $set: { status: "expired" } }
    );

    console.log(`✅ Ads updated -> live: ${liveUpdated.modifiedCount}, expired: ${expiredUpdated.modifiedCount}`);
  } catch (error) {
    console.error("❌ Error in ads cron job:", error.message);
  }
});
// For monthly token
cron.schedule('0 0 * * *', async () => { // Runs every day at 00:00
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // yyyy-mm-dd

    // Get topChoice membership for providers
    const membership = await Membership.findOne({ topChoice: true, type: 'consumer' });
    if (!membership) {
      console.log('No topChoice membership found');
      return;
    }

    // Find all active users whose tokenDate is today and have bought this membership
    const users = await User.find({
      tokenDate: {
        $exists: true,
        $lte: today // tokenDate <= today
      },
      role: 'consumer'
    });

    const userIds = [];

    for (const user of users) {
      const hasMembership = await BuyMembership.findOne({
        userId: user._id,
        membershipId: membership._id,
        status: 'active'
      });
      if (hasMembership) userIds.push(user._id);
    }

    if (userIds.length === 0) {
      console.log('No users to reset tokens today');
      return;
    }
    const result = await User.updateMany(
      { _id: { $in: userIds } },
      {
        $set: {
          monthlyToken: 5,
          tokenDate: new Date()
        }
      }
    );

    console.log(`✅ Reset monthly tokens for ${result.modifiedCount} users`);

  } catch (error) {
    console.error('❌ Cron Job Error:', error);
  }
});

// const testFun = async () => {
//   try {
//     const today = new Date();
//     const todayStr = today.toISOString().split('T')[0]; // yyyy-mm-dd

//     // Get topChoice membership for providers
//     const membership = await Membership.findOne({ topChoice: true, type: 'consumer' });
//     if (!membership) {
//       console.log('No topChoice membership found');
//       return;
//     }

//     // Find all active users whose tokenDate is today and have bought this membership
//     const users = await User.find({
//       tokenDate: {
//         $exists: true,
//         $lte: today // tokenDate <= today
//       },
//       role: 'consumer'
//     });

//     const userIds = [];

//     for (const user of users) {
//       const hasMembership = await BuyMembership.findOne({
//         userId: user._id,
//         membershipId: membership._id,
//         status: 'active'
//       });
//       if (hasMembership) userIds.push(user._id);
//     }

//     if (userIds.length === 0) {
//       console.log('No users to reset tokens today');
//       return;
//     }
//     const result = await User.updateMany(
//       { _id: { $in: userIds } },
//       {
//         $set: {
//           monthlyToken: 5,
//           tokenDate: new Date()
//         }
//       }
//     );

//     console.log(`✅ Reset monthly tokens for ${result.modifiedCount} users`);

//   } catch (error) {
//     console.error('❌ Cron Job Error:', error);
//   }
// }
// testFun()