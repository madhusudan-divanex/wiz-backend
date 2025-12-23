const ContactModel = require("../models/FrontEnd/Contact.model");
const FaqModel = require("../models/FrontEnd/Faq.model");
const ScamTip = require("../models/FrontEnd/ScamTip.model");
const BlogCategory = require("../models/FrontEnd/BlogCategory.model");
const Blog = require("../models/FrontEnd/Blog.model");


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
  const { title, description, link, isFeatured, type } = req.body;
  const image = req.files?.['image']?.[0]?.path
  try {
    if (isFeatured) {
      // Unset previous featured tips
      await ScamTip.updateMany({ isFeatured: true }, { isFeatured: false });
    }
    const tip = await ScamTip.create({ title, description, image, link, isFeatured, type });

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
    let { page = 1, limit = 10 } = req.query;
    page = Number(page);
    limit = Number(limit);

    const tips = await ScamTip.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await ScamTip.countDocuments();
    const featureTip = await ScamTip.findOne({ isFeatured: true });

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
  const { title, description, link, isFeatured, type, tipId } = req.body;
  const image = req.files?.['image']?.[0]?.path
  try {
    const isExistingTip = await ScamTip.findById(tipId);
    if (!isExistingTip) {
      return res.status(404).json({ success: false, message: "Tip not found" });
    }

    if (isFeatured) {
      // Unset previous featured tips
      await ScamTip.updateMany({ isFeatured: true }, { isFeatured: false });
    }
    if (image) {
      safeUnlink(isExistingTip.image);
    }
    const tip = await ScamTip.findByIdAndUpdate(
      tipId,
      { title, description, image: image || isExistingTip.image, link, isFeatured, type },
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
    const { question, answer, category } = req.body;

    const faq = await FaqModel.create({
      question,
      answer,
      category
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
  const {category}=req.query
  try {
    let filter={}
    if(category){
      filter.category=category
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
      const filename ='/uploads/texteditor/'+ url.split("/uploads/texteditor/")[1] ;
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
    const {name}=req.body
    try {
        const isExist=await BlogCategory.findOne({name})
        if(isExist){
            return res.status(200).json({message:"BlogCategory already exists with this name",status:false})
        }
        const newData=await BlogCategory.create({name})
        if(newData){
            return res.status(200).json({message:"Category created",status:true})
        }else{
            res.status(200).json({
                status: false,
                message:"Category not created"
            });
        }
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
};
exports.updateCategory = async (req, res) => {
    const {name,categoryId}=req.body
    try {
        const isExist=await BlogCategory.findById(categoryId)
        if(!isExist){
            return res.status(200).json({message:"Blog Category not exists with this id",status:false})
        }
        const isNameExist=await BlogCategory.findOne({name})
        if(isExist){
            return res.status(200).json({message:"Blog Category already exists with this name",status:false})
        }
        const updateData=await BlogCategory.findByIdAndUpdate(categoryId,{name},{new:true})
        if(updateData){
            return res.status(200).json({message:"Category updated",status:true})
        }else{
            return res.status(200).json({
                status: false,
                message:"Category not updated"
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
        const isExist=await BlogCategory.findById(categoryId)
        if(!isExist){
            return res.status(200).json({message:"Blog Category not exists with this id",status:false})
        }
        await BlogCategory.findByIdAndDelete(categoryId)
            return res.status(200).json({message:"Category deleted",status:true})
    } catch (err) {
        return res.status(500).json({ status: false, message: err.message });
    }
        
};
exports.createBlog = async (req, res) => {
  const { title, description,catId } = req.body;
  const image = req.files?.['image']?.[0]?.path
  try {
    const blog = await Blog.create({ title, description, image,catId });

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

    // Dynamic Mongo Filter
    let filter = {};

    // Filter by title (case-insensitive search)
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    // Filter by category ID
    if (catId) {
      filter.catId = catId;
    }

    // Filter by date (filter documents from start to end of that day)

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);

      filter.createdAt = { $gte: start, $lt: end };
    }

    // Fetch blogs with filters
    const blogs = await Blog.find(filter)
      .populate("catId")
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Count filtered results
    const total = await Blog.countDocuments(filter);

    const featureBlog = await Blog.find().sort({createdAt:-1}).limit(3);

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


// UPDATE Blog
exports.updateBlog = async (req, res) => {
  const { title, description, catId,blogId } = req.body;
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
      { title, description, image: image || isExistingBlog.image,catId},
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
  const id=req.params.id
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }
    const relatedBlog= await Blog.find({catId:blog.catId,_id:{$ne:blog._id}}).sort({createdAt:-1}).limit(3)
   
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