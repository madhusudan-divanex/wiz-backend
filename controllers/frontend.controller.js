const ContactModel = require("../models/FrontEnd/Contact.model");
const FaqModel = require("../models/FrontEnd/Faq.model");
const ScamTip = require("../models/FrontEnd/ScamTip.model");
const BlogCategory = require("../models/FrontEnd/BlogCategory.model");
const Blog = require("../models/FrontEnd/Blog.model");
const HomeBanner = require("../models/FrontEnd/HomeBanner.model");
const FindResources = require("../models/FrontEnd/FindResources.model");
const MarketGlance = require("../models/FrontEnd/MarketGlance.model");
const ExclusiveMemberships = require("../models/FrontEnd/ExclusiveMemberships.model");
const HomeHeader = require("../models/FrontEnd/HomeHeader.model")

const safeUnlink = require("../utils/globalFuntion");
const path = require("path");
exports.contactCMS = async (req, res) => {
  const { whatsappLink, email, phone, address1, address2, mobileFirst, mobileSecond } = req.body;
  const socialMedia = JSON.parse(req.body.socialMedia || "{}");
  try {
    const contactData = await ContactModel.findOne();
    if (!contactData) {
      await ContactModel.create({ whatsappLink, email, phone, address1, address2, mobileFirst, mobileSecond, socialMedia });
      return res.status(200).json({ success: true, data: contactData });
    } else {
      await ContactModel.updateOne({ _id: contactData._id }, { whatsappLink, email, phone, address1, address2, mobileFirst, mobileSecond, socialMedia }, { new: true });
      return res.status(200).json({ success: true, data: contactData });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
exports.getContactCMS = async (req, res) => {
  try {
    const contactData = await ContactModel.findOne();
    return res.status(200).json({ success: true, data: contactData });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

exports.createTip = async (req, res) => {
  const { title, description, link, isFeatured, type,dataType ,createdAt} = req.body;
  const image = req.files?.['image']?.[0]?.path
  try {
    if (isFeatured) {
      // Unset previous featured tips
      await ScamTip.updateMany({ isFeatured: true,dataType }, { isFeatured: false });
    }
    const tip = await ScamTip.create({ title, description, image, link, isFeatured, type ,dataType,createdAt});

    return res.status(200).json({
      success: true,
      data: tip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET Tips with Pagination
exports.getTips = async (req, res) => {
  try {
    let filter={}
    let { page = 1, limit = 10 ,type=''} = req.query;
    page = Number(page);
    limit = Number(limit);
    if(type){
      filter.dataType=type
    }

    const tips = await ScamTip.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ScamTip.countDocuments();
    const featureTip = await ScamTip.findOne({dataType:type}).sort({createdAt:-1});

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      data: tips,
      featureTip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE Tip
exports.updateTip = async (req, res) => {
  const { title, description, link, isFeatured, type, tipId,dataType,createdAt} = req.body;
  const image = req.files?.['image']?.[0]?.path
  try {
    const isExistingTip = await ScamTip.findById(tipId);
    if (!isExistingTip) {
      return res.status(200).json({ success: false, message: "Tip not found" });
    }

    if (isFeatured) {
      // Unset previous featured tips
      await ScamTip.updateMany({ isFeatured: true ,dataType}, { isFeatured: false });
    }
    if (image) {
      safeUnlink(isExistingTip.image);
    }
    const tip = await ScamTip.findByIdAndUpdate(
      tipId,
      { title, description, image: image || isExistingTip.image, link, isFeatured, type,dataType ,createdAt},
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: tip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE Tip
exports.deleteTip = async (req, res) => {
  try {
    const tip = await ScamTip.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({ success: false, message: "Tip not found" });
    }
    if (tip.image) {
      safeUnlink(tip.image);
    }
    await ScamTip.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Tip deleted"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// CREATE FAQ
exports.createFaq = async (req, res) => {
  try {
    const { question, answer, category,btnName,link } = req.body;

    const faq = await FaqModel.create({
      question,
      answer,
      category,btnName,link
    });

    return res.status(200).json({
      success: true,
      message: "FAQ created successfully",
      data: faq
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// GET ALL FAQS
exports.getAllFaqs = async (req, res) => {
  const { category } = req.query
  try {
    let filter = {}
    if (category) {
      filter.category = category
    }
    const faqs = await FaqModel.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: faqs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// UPDATE FAQ
exports.updateFaq = async (req, res) => {
  const faqId = req.body._id;
  try {
    const { id } = req.params;

    const faq = await FaqModel.findByIdAndUpdate(faqId, req.body, {
      new: true,
      runValidators: true
    });

    if (!faq) {
      return res.status(200).json({
        success: false,
        message: "FAQ not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      data: faq
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// DELETE FAQ
exports.deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    // Find FAQ before deleting (so we can read images inside it)
    const faq = await FaqModel.findById(id);
    if (!faq) {
      return res.status(200).json({
        success: false,
        message: "FAQ not found",
      });
    }

    const imageUrls = faq.answer.match(/src="([^"]+)"/g) || [];

    imageUrls.forEach((imgTag) => {
      const url = imgTag.replace('src="', '').replace('"', '');
      console.log("url", url)
      const filename = '/uploads/texteditor/' + url.split("/uploads/texteditor/")[1];
      console.log("filename", filename)
      if (filename) {
        safeUnlink(filename);
      }
    });

    /** ---------------------------
     * 3️⃣ DELETE FAQ FROM DB
     * --------------------------- */
    await faq.deleteOne();

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
exports.createCategory = async (req, res) => {
  const { name } = req.body
  try {
    const isExist = await BlogCategory.findOne({ name })
    if (isExist) {
      return res.status(200).json({ message: "BlogCategory already exists with this name", status: false })
    }
    const newData = await BlogCategory.create({ name })
    if (newData) {
      return res.status(200).json({ message: "Category created", status: true })
    } else {
      res.status(200).json({
        status: false,
        message: "Category not created"
      });
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};
exports.updateCategory = async (req, res) => {
  const { name, categoryId } = req.body
  try {
    const isExist = await BlogCategory.findById(categoryId)
    if (!isExist) {
      return res.status(200).json({ message: "Blog Category not exists with this id", status: false })
    }
    const isNameExist = await BlogCategory.findOne({ name })
    if (isExist) {
      return res.status(200).json({ message: "Blog Category already exists with this name", status: false })
    }
    const updateData = await BlogCategory.findByIdAndUpdate(categoryId, { name }, { new: true })
    if (updateData) {
      return res.status(200).json({ message: "Category updated", status: true })
    } else {
      return res.status(200).json({
        status: false,
        message: "Category not updated"
      });
    }
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const { page, limit, search = '', type = '' } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Add type filter if provided
    if (type) {
      query.type = type;
    }

    // If no query params (page, limit, search, type) -> return full data
    const hasQueryParams = page || limit || search || type;

    let addonData;
    let totalCategory;

    if (!hasQueryParams) {
      addonData = await BlogCategory.find(query).sort({ name: 1 });
      totalCategory = addonData.length;
    } else {
      // Paginated result
      const currentPage = parseInt(page) || 1;
      const pageLimit = parseInt(limit) || 10;

      totalCategory = await BlogCategory.countDocuments(query);
      addonData = await BlogCategory.find(query)
        .sort({ name: 1 })
        .skip((currentPage - 1) * pageLimit)
        .limit(pageLimit);
    }

    return res.status(200).json({
      status: true,
      categoryData: addonData,
      currentPage: page ? parseInt(page) : 1,
      totalPages: limit ? Math.ceil(totalCategory / limit) : 1,
      totalCategory,
    });
  } catch (err) {
    console.error("Error in getCategory:", err);
    res.status(500).json({ status: false, message: err.message });
  }
};
exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const isExist = await BlogCategory.findById(categoryId)
    if (!isExist) {
      return res.status(200).json({ message: "Blog Category not exists with this id", status: false })
    }
    await BlogCategory.findByIdAndDelete(categoryId)
    return res.status(200).json({ message: "Category deleted", status: true })
  } catch (err) {
    return res.status(500).json({ status: false, message: err.message });
  }

};
exports.createBlog = async (req, res) => {
  const { title, description, catId,link,date } = req.body;
  const image = req.files?.['image']?.[0]?.path
  try {
    const blog = await Blog.create({ title, description, image, catId ,link,date});

    return res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET Blogs with Pagination
exports.getBlogs = async (req, res) => {
  try {
    let { page = 1, limit = 10, title = "", catId = "", date = "" } = req.query;

    page = Number(page);
    limit = Number(limit);
    let filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    if (catId) {
      filter.catId = catId;
    }

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      filter.createdAt = { $gte: start, $lt: end };
    }

    // 🔥 Get featured blog first
    const featureBlog = await Blog.findOne()
      .populate("catId")
      .sort({ createdAt: -1 });

    // 👉 Exclude featured blog from list
    if (featureBlog) {
      filter._id = { $ne: featureBlog._id };
    }

    // Fetch blogs without featured one
    const blogs = await Blog.find(filter)
      .populate("catId")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Blog.countDocuments(filter);

    return res.status(200).json({
      success: true,
      total,
      totalPages: limit ? Math.ceil(total / limit) : 1,
      limit,
      data: blogs,
      featureBlog,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getTopBlogs = async (req, res) => {
  try {

    // Fetch blogs with filters
    const blogs = await Blog.find()
      .populate("catId")
      .sort({ viewCount: -1 })
      .limit(10)

    const featureBlog = await Blog.find().populate("catId").sort({ createdAt: -1 }).limit(1);

    return res.status(200).json({
      success: true,
      data: blogs,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// UPDATE Blog
exports.updateBlog = async (req, res) => {
  const { title, description, catId, blogId ,link,date} = req.body;
  const image = req.files?.['image']?.[0]?.path
  try {
    const isExistingBlog = await Blog.findById(blogId);
    if (!isExistingBlog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    if (image) {
      safeUnlink(isExistingBlog.image);
    }
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description, image: image || isExistingBlog.image, catId,link,date },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getBlogData = async (req, res) => {
  const id = req.params.id
  try {
    const blog = await Blog.findByIdAndUpdate(
      id,
      { $inc: { viewCount: 1 } },
      { new: true } // updated document return karega
    );
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    
    const relatedBlog = await Blog.find({ catId: blog.catId, _id: { $ne: blog._id } }).populate('catId').sort({ createdAt: -1 }).limit(3)

    return res.status(200).json({
      success: true,
      blog,
      message: "Blog found",
      relatedBlog
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE Blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    if (blog.image) {
      safeUnlink(blog.image);
    }
    await Blog.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Blog deleted"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


//shubham code 
exports.createHomeBanner = async (req, res) => {
  try {
    const {
      smallTitle,
      title,
      text,footerText,
      buttonName,
      buttonLink,
    } = req.body;

    const image = req.files?.["image"]?.[0]?.path || null;

    const created = await HomeBanner.create({
      smallTitle,
      title,
      text,
      buttonName,footerText,
      buttonLink,
      image,
    });

    console.log("home banner created", created);

    return res.status(200).json({
      success: true,
      message: "Home banner created",
      data: created,
    });
  } catch (error) {
    console.log("home banner not created", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getHomeBanner = async (req, res) => {
  try {
    const data = await HomeBanner.findOne().sort({ createdAt: -1 });

    console.log("home banner found", data);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log("home banner not found", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllHomeBanners = async (req, res) => {
  try {
    const data = await HomeBanner.find().sort({ createdAt: -1 });


    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log("all home banners not found", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getHomeBannerById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await HomeBanner.findById(id);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Home banner not found",
      });
    }

    console.log("home banner found by id", data);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.log("home banner not found by id", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateHomeBanner = async (req, res) => {
  try {
    const {
      bannerId,
      smallTitle,footerText,
      title,
      text,
      buttonName,
      buttonLink,
    } = req.body;

    const image = req.files?.["image"]?.[0]?.path;

    const existing = await HomeBanner.findById(bannerId);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Home banner not found",
      });
    }

    if (image && existing.image) {
      safeUnlink(existing.image);
    }

    const updated = await HomeBanner.findByIdAndUpdate(
      bannerId,
      {
        smallTitle,
        title,
        text,
        buttonName,footerText,
        buttonLink,
        image: image || existing.image,
      },
      { new: true }
    );

    console.log("home banner updated", updated);

    return res.status(200).json({
      success: true,
      message: "Home banner updated",
      data: updated,
    });
  } catch (error) {
    console.log("home banner not updated", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteHomeBanner = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await HomeBanner.findById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Home banner not found",
      });
    }

    if (existing.image) {
      safeUnlink(existing.image);
    }

    await HomeBanner.findByIdAndDelete(id);

    console.log("home banner deleted", id);

    return res.status(200).json({
      success: true,
      message: "Home banner deleted",
    });
  } catch (error) {
    console.log("home banner not deleted", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.createFindResources = async (req, res) => {
  try {
    const {
      titleLeft,
      titleHighlight,
      titleRight,
      subheading,
      bullets,
      note,
      ctaText,
      ctaLink,
    } = req.body;
    const image = req.files?.["image"]?.[0]?.path;
    const bulletArray =
      typeof bullets === "string"
        ? JSON.parse(bullets)
        : Array.isArray(bullets)
          ? bullets
          : [];

    const created = await FindResources.create({
      titleLeft,
      titleHighlight,
      titleRight,
      subheading,
      bullets: bulletArray,
      note,
      ctaText,
      ctaLink,
      image,
    });
    console.log("section created", created);
    return res
      .status(200)
      .json({ success: true, message: "Section created", data: created });
  } catch (error) {
    console.log("section not created", error.message);
    return res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

exports.getFindResources = async (req, res) => {
  try {
    const data = await FindResources.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFindResourcesById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await FindResources.findById(id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateFindResources = async (req, res) => {
  try {
    const {
      sectionId,
      titleLeft,
      titleHighlight,
      titleRight,
      subheading,
      bullets,
      note,
      ctaText,
      ctaLink,
    } = req.body;
    const image = req.files?.["image"]?.[0]?.path;
    const existing = await FindResources.findById(sectionId);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }
    const bulletArray =
      typeof bullets === "string"
        ? JSON.parse(bullets)
        : Array.isArray(bullets)
          ? bullets
          : existing.bullets;
    if (image) {
      safeUnlink(existing.image);
    }
    const updated = await FindResources.findByIdAndUpdate(
      sectionId,
      {
        titleLeft,
        titleHighlight,
        titleRight,
        subheading,
        bullets: bulletArray,
        note,
        ctaText,
        ctaLink,
        image: image || existing.image,
      },
      { new: true }
    );
    console.log("find resource updated", updated);
    return res
      .status(200)
      .json({ success: true, message: "Section updated", data: updated });
  } catch (error) {
    console.log("find resource not updated", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteFindResources = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await FindResources.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    if (existing.image) {
      safeUnlink(existing.image);
    }
    await FindResources.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Section deleted" });
  } catch (error) {
    console.log("find resource not deleted", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createMarketGlance = async (req, res) => {
  try {
    const { title, counters, note } = req.body;
    const parsedCounters =
      typeof counters === "string"
        ? JSON.parse(counters)
        : Array.isArray(counters)
          ? counters
          : [];
    const created = await MarketGlance.create({
      title,
      counters: parsedCounters,
      note,
    });
    return res
      .status(200)
      .json({ success: true, message: "Market glance created", data: created });
  } catch (error) {
    console.log("market glance not created", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMarketGlance = async (_req, res) => {
  try {
    const data = await MarketGlance.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMarketGlanceById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await MarketGlance.findById(id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMarketGlance = async (req, res) => {
  try {
    const { sectionId, title, counters, note } = req.body;
    const existing = await MarketGlance.findById(sectionId);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    const parsedCounters =
      typeof counters === "string"
        ? JSON.parse(counters)
        : Array.isArray(counters)
          ? counters
          : existing.counters;
    const updated = await MarketGlance.findByIdAndUpdate(
      sectionId,
      { title, counters: parsedCounters, note },
      { new: true }
    );
    console.log("market glance updated", updated);
    return res
      .status(200)
      .json({ success: true, message: "Market glance updated", data: updated });
  } catch (error) {
    console.log("market glance not updated", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteMarketGlance = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await MarketGlance.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    await MarketGlance.findByIdAndDelete(id);
    console.log("market glance deleted", id);
    return res.status(200).json({ success: true, message: "Section deleted" });
  } catch (error) {
    console.log("market glance not deleted", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createExclusiveMemberships = async (req, res) => {
  try {
    const {
      titleLeft,
      titleHighlight,
      titleRight,
      subheading,
      bullets,
      ctaText,
      ctaLink,
      scriptTitle,
      scriptNote,
      scriptCtaText,
      scriptCtaLink,
    } = req.body;
    const image = req.files?.["image"]?.[0]?.path;
    const bulletArray =
      typeof bullets === "string"
        ? JSON.parse(bullets)
        : Array.isArray(bullets)
          ? bullets
          : [];
    const created = await ExclusiveMemberships.create({
      titleLeft,
      titleHighlight,
      titleRight,
      subheading,
      bullets: bulletArray,
      image,
      ctaText,
      ctaLink,
      scriptTitle,
      scriptNote,
      scriptCtaText,
      scriptCtaLink,
    });
    console.log("exclusive memberships created", created);
    return res.status(200).json({ success: true, message: "Section created", data: created });
  } catch (error) {
    console.log("exclusive memberships not created", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExclusiveMemberships = async (_req, res) => {
  try {
    const data = await ExclusiveMemberships.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getExclusiveMembershipsById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await ExclusiveMemberships.findById(id);
    if (!data) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.log("exclusive memberships not found by id", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateExclusiveMemberships = async (req, res) => {
  try {
    const {
      sectionId,
      titleLeft,
      titleHighlight,
      titleRight,
      subheading,
      bullets,
      ctaText,
      ctaLink,
      scriptTitle,
      scriptNote,
      scriptCtaText,
      scriptCtaLink,
    } = req.body;
    const image = req.files?.["image"]?.[0]?.path;
    const existing = await ExclusiveMemberships.findById(sectionId);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    const bulletArray =
      typeof bullets === "string"
        ? JSON.parse(bullets)
        : Array.isArray(bullets)
          ? bullets
          : existing.bullets;
    if (image) {
      safeUnlink(existing.image);
    }
    const updated = await ExclusiveMemberships.findByIdAndUpdate(
      sectionId,
      {
        titleLeft,
        titleHighlight,
        titleRight,
        subheading,
        bullets: bulletArray,
        image: image || existing.image,
        ctaText,
        ctaLink,
        scriptTitle,
        scriptNote,
        scriptCtaText,
        scriptCtaLink,
      },
      { new: true }
    );
    console.log("exclusive memberships updated", updated);
    return res.status(200).json({ success: true, message: "Section updated", data: updated });
  } catch (error) {
    console.log("exclusive memberships not updated", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteExclusiveMemberships = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await ExclusiveMemberships.findById(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    if (existing.image) {
      safeUnlink(existing.image);
    }
    await ExclusiveMemberships.findByIdAndDelete(id);
    console.log("exclusive memberships deleted", existing);
    return res.status(200).json({ success: true, message: "Section deleted" });
  } catch (error) {
    console.log("exclusive memberships not deleted", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};


exports.createHomeHeader = async (req, res) => {
  const { title} = req.body;
  try {
    const isExist=await HomeHeader.findOne({title})
    if (isExist) {
     return res.status(200).json({message:"Title already exists",success:false})
    }
    const tip = await HomeHeader.create({ title });

    return res.status(200).json({
      success: true,
      data: tip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET Tips with Pagination
exports.getHomeHeader = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    const tips = await HomeHeader.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await HomeHeader.countDocuments();

    return res.status(200).json({
      success: true,
      total,
      page,
      limit,
      data: tips,
      
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE Tip
exports.updateHomeHeader = async (req, res) => {
  const { title, headerId } = req.body;
  try {

    const isExisting = await HomeHeader.findById(headerId);
    if (!isExisting) {
      return res.status(404).json({ success: false, message: "Title not found" });
    }
    const isExist=await HomeHeader.findOne({title})
    if (isExist) {
     return res.status(200).json({message:"Title already exists",success:false})
    }
  
    const tip = await HomeHeader.findByIdAndUpdate(
      headerId,
      { title},
      { new: true }
    );

    return res.status(200).json({
      success: true,
      data: tip
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE Tip
exports.deleteHomeHeader = async (req, res) => {
  try {
    const tip = await HomeHeader.findById(req.params.id);
    if (!tip) {
      return res.status(404).json({ success: false, message: "Tip not found" });
    }
    if (tip.image) {
      safeUnlink(tip.image);
    }
    await HomeHeader.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Header deleted"
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
