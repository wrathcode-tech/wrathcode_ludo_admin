import React, { useEffect, useState } from 'react'
import UserHeader from '../../Layout/UserHeader'
import { alertErrorMessage, alertSuccessMessage } from '../../Utils/CustomAlertMessage';
import LoaderHelper from '../../Utils/Loading/LoaderHelper';
import AuthService from '../../Api/Api_Services/AuthService';
import { imageUrl } from '../../Api/Api_Config/ApiEndpoints';

function BlogPage() {

    const blogCategory = ["Crypto Wallet Security", "Blockchain & Web3 Technology", "Wallet Recovery & Case Studies", "Crypto Scams & Fraud Awareness", "Crypto Guides for Beginners"]

    const [blogType, setBlogType] = useState("");
    const [blogTitle, setBlogTitle] = useState("");
    const [blogImage, setBlogImage] = useState("");
    const [blogContent, setBlogContent] = useState("");
    const [blogList, setBlogList] = useState();

    const handleAddBlog = async () => {

        if (!blogType || !blogTitle || !blogImage || !blogContent) {
            alertErrorMessage("Please add blog type, blog title and image");
            return;
        }

        try {
            LoaderHelper.loaderStatus(true);
            var formData = new FormData();
            formData.append("category", blogType);
            formData.append("title", blogTitle);
            formData.append("blogMedia", blogImage);
            formData.append("content", blogContent);

            const result = await AuthService.addBlog(formData);
            if (result?.success) {
                alertSuccessMessage(result?.message);
                handleBlogList();
                setBlogType("");
                setBlogTitle("")
                setBlogImage("")
                setBlogContent("")
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };


    const handleBlogList = async () => {

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.blogList();
            if (result?.success) {
                setBlogList(result?.data?.reverse())
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };


    const handleDeleteBlog = async (id) => {

        try {
            LoaderHelper.loaderStatus(true);
            const result = await AuthService.deleteBlog(id);
            if (result?.success) {
                alertSuccessMessage(result?.message)
                handleBlogList()
            } else {
                alertErrorMessage(result?.message);
            }
        } catch (error) {
            alertErrorMessage(error?.message);
        } finally {
            LoaderHelper.loaderStatus(false);
        }
    };


  const handleChangeSelfie = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (allowedTypes.includes(file.type)) {
        setBlogImage(file);
        alertSuccessMessage(file?.name)
    
      } else {
        if (!allowedTypes.includes(file.type)) {
          alertErrorMessage("Only PNG, JPEG, and JPG file types are allowed.");
        }
      }
    }
  };

    useEffect(() => {
        handleBlogList()

    }, []);


    return (

        <>
            <div class="dashboard_right">
                <UserHeader />
                <div class="dashboard_outer_s">
                    <h2>Blog</h2>
                    <div class="dashboard_detail_s user_list_table">
                        <div class="form_notification">
                            <h4>Add New Blog</h4>
                            <form>
                                <div class="fill_input">
                                    <label>Type</label>
                                    <select class="input_inb" value={blogType} onChange={(e)=>setBlogType(e.target.value)}>
                                        <option selected hidden>Select Blog Type</option>
                                        {blogCategory?.map((category) => {

                                            return (
                                                <option>{category}</option>
                                            )
                                        })}

                                    </select>
                                </div>
                                <div class="fill_input">
                                    <label>Blog Title</label>
                                    <input class="input_inb" type="text" placeholder="Enter Text" value={blogTitle} onChange={(e)=>setBlogTitle(e.target.value)}/>
                                </div>
                                <div class="fill_input">
                                    <label>Blog Images</label>
                                    <input class="input_inb" type="file" placeholder="" onChange={handleChangeSelfie}/>
                                </div>
                                <div class="fill_input">
                                    <label>Blog Content</label>
                                    <textarea class="input_inb" value={blogContent} onChange={(e)=>setBlogContent(e.target.value)}></textarea>
                                </div>
                                <div class="fill_input">
                                    <input type="button" value="Submit" onClick={handleAddBlog} />
                                </div>
                            </form>
                        </div>
                        <div class="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Type</th>
                                        <th>Title</th>
                                        <th>Content</th>
                                        <th>Banner Image</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogList?.map((item,index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{item?.category}</td>
                                                <td class="content_tb">
                                                    <p>{item?.title}</p>
                                                </td>
                                                <td class="content_tb">
                                                    <p>{item?.content}</p>
                                                </td>
                                                <td>
                                                    <div class="blog_img"><img src={imageUrl + item?.blogMedia} loading="lazy" alt="blog" /></div>
                                                </td>
                                                <td class="Inactive"><button onClick={()=>handleDeleteBlog(item?._id)}>Delete</button></td>
                                            </tr>
                                        )
                                    })}


                                </tbody>
                            </table>
                        </div>
                        {/* <div class="pagination_list">
                            <p>Showing data 1 to 8 of 256K entries</p>
                            <ul class="pagination">
                                <li class="page-item">
                                    <a class="page-link" href="#" aria-label="Previous">
                                        <span aria-hidden="true">&laquo;</span>
                                        <span class="sr-only">Previous</span>
                                    </a>
                                </li>
                                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                <li class="page-item"><a class="page-link" href="#">2</a></li>
                                <li class="page-item"><a class="page-link" href="#">3</a></li>
                                <li class="page-item"><a class="page-link" href="#">4</a></li>
                                <li class="page-item"><a class="page-link" href="#">5</a></li>
                                <li class="page-item"><a class="page-link" href="#">...</a></li>
                                <li class="page-item">
                                    <a class="page-link" href="#" aria-label="Next">
                                        <span aria-hidden="true">&raquo;</span>
                                        <span class="sr-only">Next</span>
                                    </a>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </div>
            </div>

        </>
    )
}

export default BlogPage