module.exports = {
  providerBuyMembership: {
    title: "Application for Accreditation Received",
    body: `
      <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Thank you for submitting your application for accreditation with Wizbizla. We’ve received your documents and are excited to review your application
</p>

<p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Please note that we operate on a <span style="font-weight:700;">3-working day</span> service level, and your documentation will be processed within this timeframe.
</p>

<p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Kindly be aware that not all applications for membership are accepted, as we carefully evaluate each provider to ensure they meet our guidelines. You will receive an update regarding our decision via email within after your application has been reviewed.
</p>

<p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Thank you for choosing Wizbizla—we appreciate your interest in joining our trusted network!
</p>




    `
  },

  consumerBuyMembership: {
    title: "Welcome to Your Wizbizla Premium Membership!",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Welcome to Wizbizla! We’re thrilled to <span style="font-weight:700;">have you as a Premium Member</span>. Your membership includes <span style="font-weight:700;">5 bespoke concierge tokens</span> each month, designed to enhance your experience.
</p>

<p style="padding-top:8px; padding-bottom:0; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  <span style="font-weight:700;">Important Details:</span>
</p>

<ul style="padding-left: 20px; margin-top:0; margin-bottom:16px; color:#626884; font-size:18px; font-weight:400; line-height:24px; list-style-type: disc;">
  <li>
    Monthly Usage: You can make up to <span style="font-weight:700;">5 bespoke concierge requests</span> each month. Please note that these tokens <span style="font-weight:700;">do not roll over</span> — use them or lose them!
  </li>
  <li>
    <span style="font-weight:700;">Effortless Support:</span> Our dedicated team is here to handle all your needs. We take care of vetting, providing recommendations, and resolving any issues, ensuring a seamless experience tailored to your preferences and budget.
  </li>
</ul>

<p style="padding-top:12px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  To start using your tokens, simply click the button below to redeem one and access the <span style="font-weight:700;">Bespoke Concierge Form</span> on your dashboard:
</p>

<div style="margin: 24px 0; display: flex;">
  <a href="javascript:void(0)" style="
      display: inline-block;
      padding: 12px 20px;
      background-color: #4F40FF;
      border: 1px solid #4F40FF;
      border-radius: 4px;
      color: #fff;
      font-weight: 500;
      font-size: 16px;
      text-align: center;
      text-decoration: none;
      width: 200px;
      cursor: pointer;
    ">
    Redeem a Token
  </a>
</div>

<p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  For more details on the services available to you, visit the <a href="javascript:void(0)" style="color:#4F40FF; font-weight:600; text-decoration: underline; cursor: pointer;">Premium Services</a> page on Wizbizla.
</p>



    `
  },

  inviteUser: {
    title: " is Ready to Share Wizbizla’s Secret to Boosting Business Visibility!",
    body: `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:0px;">
    <img src="https://api.wizbizlaonboard.com/uploads/assetes/email-usr.jpg" alt="Marilyn Mango" style="width:37px; height:37px; border-radius:50%;">
    <h5 style="font-size:16px; color:#626884; font-weight:400; margin-bottom:0;">Marilyn Mango</h5>
</div>
      <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  <span>Sign up for Wizbizla</span> and get accredited today! It’s the easiest way to enhance your business presence and tap into 360-degree marketing at an unbeatable price.
</p>

<ul style="padding-left: 20px; margin-top:0; margin-bottom:16px; color:#626884; font-size:18px; font-weight:400; line-height:24px; list-style-type: disc;">
  <li><span style="font-weight:700;">Accreditation:</span> Differentiate yourself from the competition (and those shifty, unscrupulous service providers lurking in your industry!).</li>
  <li><span style="font-weight:700;">Ideal Client Matches:</span> Save time, money, and resources by connecting with your perfect clients.</li>
  <li><span style="font-weight:700;">Massive ROI:</span> Reach new expats and grow your business effortlessly.</li>
</ul>

<p style="padding-top:12px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Plus, enjoy <span style="font-weight:700;">10% off your first membership!</span> Cancel anytime, no commitments. Sounds too good to be true? See for yourself—log onto <span style="font-weight:700;">Wizbizla</span> and explore your options.
</p>

<div style="margin: 24px 0; display: flex;">
  <a href="{{link}}" style="
      display: inline-block;
      padding: 12px 20px;
      background-color: #4F40FF;
      border: 1px solid #4F40FF;
      border-radius: 4px;
      color: #fff;
      font-weight: 500;
      font-size: 16px;
      text-align: center;
      text-decoration: none;
      width: 200px;
      cursor: pointer;
    ">
    Visit Wizbizla
  </a>
</div>




    `
  },

  otp: {
    title: "Your OTP for wizbizla!",
    body: `
      <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Your One-Time Password (OTP) for WizBizla is: {{OTP}} This OTP is valid for 10 minutes. 
  Please do not share it with anyone. If you did not request this, please ignore this email.
</p>
    `
  },
  reportScam: {
    title: "Thank You for Helping Combat Fraud – Your Story Matters! ",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Thank you for sharing your scam experience with us by filling out the Report a Scam form. Your contribution is truly invaluable in helping protect others in the expat community from similar frauds. Together, we’re building a safer, more informed community. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  We’re excited to announce that our new Scam Tracker feature is coming soon! This tool will enable members to conduct thorough background checks on service providers, helping them make informed decisions. By sharing your story, you’ve played an important role in educating others and preventing future scams. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Please note that the Wizbizla team reviews all stories to ensure they comply with legal guidelines and UAE laws before they’re posted on the Scam Tracker. This process guarantees that the information shared is both accurate and legally sound. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  You will be notified once your post is approved and published on our Scam Tracker. Thank you again for your support in combating fraud within our community. 
</p>
<h6 style="padding-top:8px; padding-bottom:8px; font-weight:bold;font-size:16px; color:#626884; line-height:24px;">Together, we can make a difference! </h6>

    `
  },
  liveScam: {
    title: "Your Post is Live on the Wizbizla Scam Tracker!",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  We are pleased to inform you that your story has been approved and is now live on the Wizbizla Scam Tracker! Your contribution plays a vital role in helping others navigate potential scams and stay informed. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  By sharing your experience, you’re not only empowering fellow expats but also fostering a safer community for everyone. We encourage you to share the Scam Tracker with friends and family, as it serves as an essential tool for conducting thorough background checks on service providers.  
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Thank you once again for your support and for being an integral part of our mission to combat fraud. Together, we can make a significant difference in protecting our community! 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  If you have any further questions or would like to share additional insights, feel free to reach out. 
</p>

    `
  },
  rejectScam: {
    title: "Update on Your Scam Submission ",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Thank you for taking the time to share your scam experience with us. We understand how difficult and frustrating these situations can be, and we truly sympathize with what you've gone through. Your willingness to help protect others by sharing your story is greatly appreciated. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  After careful review by our team, we regret to inform you that we are unable to publish your submission on the Wizbizla Scam Tracker. This decision was made because certain elements of the story do not fully comply with local UAE laws and legal guidelines.  
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 We understand that this may be disappointing, especially given the effort you've put into contributing to the safety of our community. If you would like more information about this decision, or if you have any questions, please don't hesitate to reach out to us at +971554500347. We’re here to assist you in any way we can. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
Thank you again for your courage in sharing your experience. We hope to continue working with you in other ways to help make the expat community safer.
</p>

    `
  },
  podcastSubscribe: {
    title: "Expats in Dubai Podcast - Thank You for Your Interest! ",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Thank you for your interest in joining the Expats in Dubai Show. We’re thrilled about the opportunity to connect with you and showcase your expertise to our expat community. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  A member of the Wizbizla team will reach out soon to discuss the next steps. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 We look forward to having you on the show! 
</p>`
  },
  blogSubscribe: {
    title: "Minute with Wizbizla - Thank You for Your Interest! ",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Thank you for your interest in subscribing the Minute of wizbizla. We’re thrilled about the opportunity to connect with you and showcase your expertise to our expat community. 
</p>
 
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 We look forward to having you on the show! 
</p>`
  },
  podcastSubscribe: {
  title: "Welcome to the Podcast – You're Subscribed! 🎙️",
  body: `
  <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
    Thank you for subscribing to our podcast! We're excited to have you join our growing community of listeners who are passionate about insightful conversations and fresh perspectives.
  </p>

  <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
    Get ready to explore engaging episodes, expert insights, and inspiring stories delivered straight to you.
  </p>

  <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
    Stay tuned — your next favorite episode is just around the corner!
  </p>
  `
},
  contactQuery: {
    title: "Thank you for your message  ",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Thank you for contacting Wizbizla and taking the time to write to us. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  All communication and enquiries are extremely important to us and as such we aim to respond to you within 3 business days. 
</p>
 <p style="padding-top:8px;  font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 We look forward to assisting you soon. 
</p>`
  },
  adRecived: {
    title: "Thank You for Your Banner Advertisement Submission ",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  Thank you for your inquiry! 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  We have received your submission successfully. Please note that we operate with a 5-working day service level, so your inquiry will be processed within this timeframe. A member of the Wizbizla team will reach out to you shortly to assist with your request. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 In the meantime, if you have any questions or need further assistance, please do not hesitate to contact us.  
</p>`
  },
  businessLive: {
    title: "Congratulations! Your Business Profile is Now LIVE! ",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  We’re thrilled to inform you that your Business Profile is now LIVE on the Wizbizla platform! 🎉 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  You can edit and update your profile anytime through your account dashboard to ensure it stays fresh and relevant. To help you make the most of your listing, we recommend visiting our <a href="{{clientUrl}}/how-complete-business-profile" target="_blank> How to Complete Your Business Profile </a> page, where you’ll find tips and advice on how to make your profile stand out and attract more clients. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 As a Business Profile member, here’s what you can expect: 
</p>
<ul style="padding-left: 20px; margin-top:0; margin-bottom:16px; color:#626884; font-size:18px; font-weight:400; line-height:24px; list-style-type: disc;">
  <li><span style="font-weight:700;">Visibility in Our Trusted Network:</span> Your profile is now accessible to a growing community of expats in the UAE looking for reliable and trustworthy service providers like you. </li>
  <li><span style="font-weight:700;">Core Platform Features:</span> Use features like the Wizbizla Partner Network to link with other trusted professionals, showcasing your collaborations and enhancing your credibility. This helps you reach a wider audience, demonstrate key partnerships, and build trust with clients. It’s an easy way to highlight who you work with and what sets your services apart. </li>
  
</ul>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 We’ll be sharing more resources with you to help you make the most of your profile and increase your visibility on the platform. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
Thank you for joining Wizbizla! We’re excited to have you on board and look forward to helping your business thrive. 
</p>`

  },
  signatureLive: {
    title: "Congratulations! Your Signature Profile is Now LIVE! ",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 We’re thrilled to inform you that your Signature Profile is now LIVE on the Wizbizla platform! 🎉 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  You can edit your profile anytime through your account dashboard to keep it up to date. To help you make the most of your profile, we encourage you to visit our <a href="{{clientUrl}}/how-complete-business-profile" target="_blank> How to Complete Your Business Profile </a> page. This resource provides valuable tips on how to make your profile stand out and highlights all the features you can utilize.
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
As a Signature Member, you enjoy exclusive benefits, including: 
</p>
<ul style="padding-left: 20px; margin-top:0; margin-bottom:16px; color:#626884; font-size:18px; font-weight:400; line-height:24px; list-style-type: disc;">
  <li><span style="font-weight:700;">Comprehensive Marketing Support:</span>As part of your membership, you'll benefit from cost-effective 360-degree marketing support. This is one of the best investments you can make to enhance and complement your own marketing efforts, ensuring you reach a wider audience and maximize your impact.</li>
  <li><span style="font-weight:700;">Request a Trusted Reference Program:</span>You have the option to enroll in this program, enhancing your credibility and connecting you with potential clients.</li>
  <li><span style="font-weight:700;">Loyalty Rewards Points Program:</span>You’ll be automatically enrolled in this program, allowing you to earn points that can be redeemed for strategic advertising spots on the platform. </li>
  
</ul>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 We’re committed to your success, and we will share additional resources to help you maximize your membership benefits. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
Thank you for being part of Wizbizla, and we look forward to supporting your growth! 
</p>`
  },
  profileRemoveAdmin: {
    title: "Important Update: Your Wizbizla Profile Removal ",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 We hope this message finds you well. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  We regret to inform you that your profile has been removed from the Wizbizla platform due to a violation of our community standards or policies. As a result, your membership will be cancelled, and any recurring payments will cease. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
If you have already made a payment for your membership, please note that according to our policy, joining fees are non-refundable. However, any unused portion of your membership fee will be considered for a refund based on the date of removal.  
</p>

 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 If you believe this decision is in error or if you have any questions regarding this action, please don’t hesitate to reach out to us for further information. Your feedback is important to us, and we want to ensure clarity regarding our community guidelines. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
Thank you for your understanding, and we appreciate your cooperation. 
</p>`
  },
  selfAccountClose: {
    title: "Your Account Has Been Closed – We’re Sad to See You Go! ",
    body: `
     <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 We noticed that you’ve removed your profile from Wizbizla, and we’re truly sorry to see you leave our community. Your presence has been valued, and we want to thank you for being part of our journey. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
  We’d love to hear your feedback! Understanding your experience and the reasons behind your decision to close your account is incredibly important to us. Your insights will help us improve and provide better services to our community. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
<a href="{{clientUrl}}" style="color:#4F40FF;"> Share Your Feedback </a>
(Click here to let us know how we can do better!)   
</p>

 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 If there’s anything specific we could have done differently, or if you have suggestions on how we can enhance our platform, we’d be grateful to hear from you. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
If you ever decide to return, we’ll be here to welcome you back with open arms. In the meantime, if you need any further assistance, please don’t hesitate to reach out. 
</p>
 <p style="padding-top:8px; padding-bottom:8px; font-size:18px; font-weight:400; color:#626884; line-height:24px;">
 Thank you once again, and we wish you all the best in your future endeavors!
 </p>
`
  },

};
