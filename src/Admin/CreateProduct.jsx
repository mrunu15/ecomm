import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  createProduct,
  removeErrors,
  removeSuccess,
} from "../feature/admin/adminSlice";
import { toast } from "react-toastify";

function CreateProduct() {
  const { success, loading, error } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [details, setDetails] = useState({
    shoes: { size: [] },
    tshirt: { size: [] },
    lower: { size: [] },
    watch: { brand: "", waterResistant: false },
  });

  const categories = ["shoes", "tshirt", "lower", "watch"];

  const createProductSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("discountPrice", discountPrice || 0);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

    myForm.set("details", JSON.stringify(details));

    images.forEach((img) => {
      myForm.append("images", img);
    });

    dispatch(createProduct(myForm));
  };

  const createProductImage = (e) => {
    const files = Array.from(e.target.files);

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagePreview((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSizeChange = (type, value) => {
    setDetails((prev) => ({
      ...prev,
      [type]: { ...prev[type], size: value.split(",").map((s) => s.trim()) },
    }));
  };

  const handleWatchChange = (field, value) => {
    setDetails((prev) => ({
      ...prev,
      watch: { ...prev.watch, [field]: value },
    }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
    if (success) {
      toast.success("Product Created successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());


      setName("");
      setPrice("");
      setDiscountPrice("");
      setDescription("");
      setCategory("");
      setStock("");
      setDetails({
        shoes: { size: [] },
        tshirt: { size: [] },
        lower: { size: [] },
        watch: { brand: "", waterResistant: false },
      });
      setImages([]);
      setImagePreview([]);
    }
  }, [dispatch, error, success]);


  const removeImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Create Product" />
      <div className="max-w-3xl mx-auto mt-6 p-6 px-4 sm:px-6 md:px-8 transition-all mb-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Create Product</h1>
        <form
          className="flex flex-col gap-5"
          encType="multipart/form-data"
          onSubmit={createProductSubmit}
        >
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center transition-colors hover:border-[#bef264] max-w-xs mx-auto">
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={createProductImage}
              className="hidden"
            />
            <label htmlFor="image-upload" className="cursor-pointer">
              <svg
                className="mx-auto h-10 w-10 text-[#a5d64c]"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="mt-3 flex flex-col text-md text-[#a5d64c]">
                <span className="font-medium text-[#a5d64c]">Click to upload</span>

              </div>
            </label>
          </div>

          {imagePreview.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Images</h3>
              <div className="flex flex-wrap gap-4">
                {imagePreview.map((img, index) => (
                  <div key={index} className="relative w-24 h-24 group">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg border border-gray-200 shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
                    >
                      ✖
                    </button>
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                      {images[index]?.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative w-full">
            <input
              type="text"
              id="name"
              placeholder=" "
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
            />
            <label
              htmlFor="name"
              className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
            >
              Product Name
            </label>
          </div>



          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative w-full">

              <input
                id="price"
                type="number"
                placeholder=" "
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
              <label
                htmlFor="price"
                className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Enter the Price
              </label>
            </div>
            <div className="relative w-full">
              <input
                id="discountPrice"
                type="number"
                placeholder=" "
                required
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
              <label
                htmlFor="discountPrice"
                className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Enter the discountPrice
              </label>
            </div>
            <label
              htmlFor="discountPrice"
              className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
            >
              Enter the discount Price
            </label>
          </div>

          <div className="relative w-full">

            <textarea
              id="description"
              placeholder=" "
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
            />
            <label
              htmlFor="description"
              className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
            >
              Enter the Description
            </label>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
    
    <div
        className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 shadow-sm flex justify-between items-center cursor-pointer hover:border-[#a5d64c]"
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
    >
        <span className={category ? 'text-gray-900' : 'text-gray-500'}>
            {category.charAt(0).toUpperCase() + category.slice(1) || "Choose a Category"}
        </span>
        {/* Dropdown Arrow Icon */}
        <svg
            className={`h-5 w-5 transition-transform ${isCategoryOpen ? 'transform rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
    </div>

    {/* Dropdown List */}
    {isCategoryOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-[#bef264] rounded-md shadow-lg">
            {categories.map((item) => (
                <div
                    key={item}
                    className={`py-1 px-3 cursor-pointer transition-colors text-gray-900 
                        ${
                            
                            category === item 
                                ? 'bg-[#bef264] font-semibold' 
                                : 'hover:bg-[#bef264]/70 hover:text-gray-900' 
                        }
                    `}
                    onClick={() => {
                        setCategory(item);
                        setIsCategoryOpen(false); 
                    }}
                >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                </div>
            ))}
        </div>
    )}
    
    
    <input
        type="hidden"
        name="category"
        value={category}
        required
    />
</div>

            
            <div className="relative w-full">

              <input
                type="number"
                id="stock"
                placeholder=""
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
              <label
                htmlFor="stock"
                className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Enter the Stock
              </label>
            </div>
          </div>


          {category === "shoes" && (
            <div className="relative w-full">
              
              <input
                type="text"
                id="details.shoes.size"
                placeholder=" "
                value={details.shoes.size.join(",")}
                onChange={(e) => handleSizeChange("shoes", e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
               <label
                htmlFor="details.shoes.size"
                className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Shoe Sizes e.g., 7, 8, 9, 10
              </label>
            </div>
          )}
          {category === "tshirt" && (
            <div className="relative w-full">
              
              <input
                type="text"
                id="details.tshirt.size"
                placeholder=""
                value={details.tshirt.size.join(",")}
                onChange={(e) => handleSizeChange("tshirt", e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
              <label
                htmlFor="details.tshirt.size"
                className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                T-shirt Sizes e.g., S, M, L, XL
              </label>
            </div>
          )}
          {category === "lower" && (
            <div className="relative w-full">
             
              <input
                type="text"
                id="details.lower.size"
                placeholder=""
                value={details.lower.size.join(",")}
                onChange={(e) => handleSizeChange("lower", e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
               <label
                htmlFor="details.lower.size"
                className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Lower Sizes e.g., 28, 30, 32, 34
              </label>
            </div>
          )}
          {category === "watch" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative w-full">
                
                <input
                  type="text"
                  id="details.watch.brand"
                  placeholder=""
                  value={details.watch.brand}
                  onChange={(e) => handleWatchChange("brand", e.target.value)}
                 className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
            />
            <label
                htmlFor="details.watch.brand"
                className="absolute left-3 top-2.5 px-1 bg-white text-gray-900 text-sm transition-all
      peer-placeholder-shown:top-4 peer-placeholder-shown:text-md peer-placeholder-shown:text-gray-900
      peer-focus:-top-2 peer-focus:text-sm peer-focus:text-gray-900
      peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs"
              >
                Enter Watch brand
              </label>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 p-3">
                  <input
                    type="checkbox"
                    checked={details.watch.waterResistant}
                    onChange={(e) =>
                      handleWatchChange("waterResistant", e.target.checked)
                    }
                    className="h-4 w-4 text-[#bef264] focus:ring-[#a5d64c] border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Water Resistant</span>
                </label>
              </div>
            </div>
          )}


          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="w-full md:w-1/2 p-3 bg-[#bef264] text-lg text-gray-900 hover:text-white font-semibold rounded-md hover:bg-[#a5d64c] transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Product...
                </div>
              ) : "Create Product"}
            </button>
          </div>
        </form>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default CreateProduct;