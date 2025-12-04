const cron = require('node-cron');
const mongoose = require('mongoose');
const Membership = require('../models/buymembership.model'); // Adjust the path to your model
const User = require('../models/user.model');
const ProviderAccreditation = require('../models/Provider/providerAccreditation.model');
const OpenDispute = require('../models/OpenDispute');
const safeUnlink = require('./globalFuntion');
const Advertisement = require('../models/Provider/providerAdvertisement.model');

cron.schedule('0 1 * * *', async () => {
    console.log('🔁 Cron Job Running: Checking expired memberships');

    const today = new Date();

    try {
        const result = await Membership.updateMany(
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

        const nextResult = await Membership.updateMany(
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
    const accreditations = await ProviderAccreditation.find({});

    for (const acc of accreditations) {
      if (!acc.licenses || acc.licenses.length === 0) continue;

      // Check if all licenses are expired
      const allExpired = acc.licenses.every(
        lic => lic.licenseExpiryDate && new Date(lic.licenseExpiryDate) < today
      );

      if (allExpired) {
        // Update user status to pending
        await User.findByIdAndUpdate(acc.userId, { status: 'tdraft' });
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
        await Dispute.deleteOne({ _id: dispute._id });
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

    const today = moment().startOf('day').toDate();

    // 1. Set APPROVED ads to LIVE when startDate == today
    const liveUpdated = await Advertisement.updateMany(
      {
        status: "approve",
        startDate: {
          $gte: today,
          $lt: moment(today).add(1, "day").toDate()
        }
      },
      { $set: { status: "live" } }
    );

    // 2. Set LIVE ads to EXPIRED when endDate < today
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
