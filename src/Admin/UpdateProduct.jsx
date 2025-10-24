// import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetails } from "../feature/products/productSlice";
import { removeErrors, removeSuccess, updateProduct } from "../feature/admin/adminSlice";
import { toast } from "react-toastify";
import React, { useEffect, useState, useRef } from "react";


function UpdateProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState([]);
  const [oldImage, setOldImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Category-specific details
  const [details, setDetails] = useState({
    shoes: { size: [] },
    tshirt: { size: [] },
    lower: { size: [] },
    watch: { brand: "", waterResistant: false },
  });

  const { product } = useSelector((state) => state.product);
  const { success, error, loading } = useSelector((state) => state.admin);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { updateId } = useParams();

  const categories =["shoes", "tshirt", "lower", "watch"]

  useEffect(() => {
    if (updateId) dispatch(getProductDetails(updateId));
  }, [dispatch, updateId]);

  useEffect(() => {
    if (product) {
      setName(product.name || "");
      setPrice(product.price || "");
      setDiscountPrice(product.discountPrice || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setStock(product.stock || "");
      setOldImage(product.images || []);

      setDetails({
        shoes: product.details?.shoes || { size: [] },
        tshirt: product.details?.tshirt || { size: [] },
        lower: product.details?.lower || { size: [] },
        watch: product.details?.watch || { brand: "", waterResistant: false },
      });
    }
  }, [product]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = [];
    const images = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          previews.push(reader.result);
          images.push(reader.result);
          setImagePreview([...previews]);
          setImage([...images]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePreviewImage = (index) => {
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
    setImage((prev) => prev.filter((_, i) => i !== index));
  };

  const removeOldImage = (index) => {
    setOldImage((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDetailChange = (field, value, subField = null) => {
    setDetails((prev) => ({
      ...prev,
      [field]: subField ? { ...prev[field], [subField]: value } : value,
    }));
  };

  const updateProductSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("discountPrice", discountPrice);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);

    image.forEach((img) => myForm.append("image", img));
    oldImage.forEach((img) => myForm.append("oldImage", img.url || img));

    myForm.set("details", JSON.stringify(details));

    dispatch(updateProduct({ id: updateId, formData: myForm }));
  };

  useEffect(() => {
    if (success) {
      toast.success("Product Updated Successfully", { position: "top-center", autoClose: 3000 });
      dispatch(removeSuccess());
      navigate("/admin/products");
    }
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error, success, navigate]);

  const CustomSelect = ({ value, onChange, options, placeholder = "Choose a Category" }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        listRef.current &&
        !listRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(!open)}
        className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 py-2 flex justify-between items-center focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm transition-all duration-150"
      >
        <span className={value ? "capitalize" : "text-gray-400"}>
          {value ? value : placeholder}
        </span>
        <svg
          className="h-4 w-4 ml-2 text-gray-600"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-1 w-full bg-white border border-[#bef264] rounded-md shadow-lg max-h-56 overflow-auto"
        >
          {options.map((opt) => (
            <li
              key={opt}
              onClick={() => handleSelect(opt)}
              className={`cursor-pointer px-3 py-1 transition-colors duration-150 ${
                value === opt
                  ? "bg-[#a5d64c] text-white font-semibold" // selected = dark green
                  : "hover:bg-[#bef264] hover:text-black" // hover = light green
              }`}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};



  return (
    <>
      <Navbar />
      <PageTitle title="Update Product" />
      <div className="max-w-4xl mx-auto my-8 p-6 mt-28 sm:p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">Update Product</h1>
        <form className="space-y-6" encType="multipart/form-data" onSubmit={updateProductSubmit}>
          <div className="flex gap-6">
            {/* Product Name */}
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-2">Product Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
        focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-2">Price</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
        focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Discount Price</label>
            <input type="number" required value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Description</label>
            <textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows="4" className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
            />
          </div>

          {/* <div>
            <label className="block text-gray-700 font-medium mb-2">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
            >
              <option value="">Choose a Category</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>

          </div> */}
          <div>
  <label className="block text-gray-700 font-medium mb-2">Category</label>

  <CustomSelect
    value={category}
    onChange={(val) => setCategory(val)}
    options={categories}
    placeholder="Choose a Category"
  />
</div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">Stock</label>
            <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
            />
          </div>

          {/* Category Details */}
          {category === "shoes" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Shoes Sizes (comma separated)</label>
              <input type="text" value={details.shoes.size.join(",")} onChange={(e) => handleDetailChange("shoes", e.target.value.split(","), "size")} className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
            </div>
          )}
          {category === "tshirt" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Tshirt Sizes (comma separated)</label>
              <input type="text" value={details.tshirt.size.join(",")} onChange={(e) => handleDetailChange("tshirt", e.target.value.split(","), "size")} className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
            </div>
          )}
          {category === "lower" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Lower Sizes (comma separated)</label>
              <input type="text" value={details.lower.size.join(",")} onChange={(e) => handleDetailChange("lower", e.target.value.split(","), "size")} className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
              />
            </div>
          )}
          {category === "watch" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Brand</label>
                <input type="text" value={details.watch.brand} onChange={(e) => handleDetailChange("watch", e.target.value, "brand")} className="peer w-full text-gray-900 text-md border border-[#bef264] rounded-md px-3 pt-4 pb-2 
      focus:outline-none focus:border-[#a5d64c] hover:border-[#a5d64c] shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" checked={details.watch.waterResistant} onChange={(e) => handleDetailChange("watch", e.target.checked, "waterResistant")} />
                <span>Water Resistant</span>
              </div>
            </div>
          )}

          {/* New Images */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Upload Images</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} className="w-full border-2 border-dashed border-[#bef264] rounded-xl p-4 text-gray-500 cursor-pointer hover:border-[#5ac8fa]" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
              {imagePreview.map((img, index) => (
                <div key={index} className="relative w-full h-28">
                  <img src={img} alt={`Preview ${index}`} className="w-full h-28 object-cover rounded-lg border" />
                  <button type="button" onClick={() => removePreviewImage(index)} className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs hover:bg-red-700">✖</button>
                </div>
              ))}
            </div>
          </div>

          {/* Old Images */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Current Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {oldImage?.map((img, index) => (
                <div key={index} className="relative w-full h-28">
                  <img src={img.url || img} alt={`Old ${index}`} className="w-full h-28 object-cover rounded-lg border" />
                  <button type="button" onClick={() => removeOldImage(index)} className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs hover:bg-red-700">✖</button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button type="submit" className="w-1/2 bg-[#bef264] text-lg hover:bg-[#a5d64c] hover:text-white text-gray-900 font-bold py-3 rounded shadow-md transition">
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default UpdateProduct;
