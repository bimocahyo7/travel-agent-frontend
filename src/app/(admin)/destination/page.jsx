"use client";

import { useEffect, useState } from "react";
import Header from "@/app/(admin)/Header";
import { useDestination } from "@/hooks/destination";

const Destinations = () => {
  const {
    destinations,
    loading,
    addDestination,
    updateDestination,
    deleteDestination,
    error,
    success,
    clearMessages,
  } = useDestination();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
    image: null,
  });
  
  // State untuk validasi form
  const [formErrors, setFormErrors] = useState({
    name: "",
    location: "",
    description: "",
    price: "",
    image: "",
  });
  
  // State untuk preview image
  const [imagePreview, setImagePreview] = useState(null);

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      description: "",
      price: "",
      image: null,
    });
    setFormErrors({
      name: "",
      location: "",
      description: "",
      price: "",
      image: "",
    });
    setImagePreview(null);
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    setFormErrors(prev => ({...prev, [name]: ""}));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi tipe file
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setFormErrors(prev => ({...prev, image: "Format gambar harus JPG, PNG, atau GIF"}));
        return;
      }
      
      // Validasi ukuran file (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setFormErrors(prev => ({...prev, image: "Ukuran gambar maksimal 2MB"}));
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setFormErrors(prev => ({...prev, image: ""}));
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...formErrors };
    
    // Validate name (3-50 characters)
    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Nama destinasi minimal 3 karakter";
      isValid = false;
    } else if (formData.name.length > 50) {
      newErrors.name = "Nama destinasi maksimal 50 karakter";
      isValid = false;
    }
    
    // Validate location (3-100 characters)
    if (!formData.location || formData.location.length < 3) {
      newErrors.location = "Lokasi minimal 3 karakter";
      isValid = false;
    } else if (formData.location.length > 100) {
      newErrors.location = "Lokasi maksimal 100 karakter";
      isValid = false;
    }
    
    // Validate description (10-500 characters)
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = "Deskripsi minimal 10 karakter";
      isValid = false;
    } else if (formData.description.length > 500) {
      newErrors.description = "Deskripsi maksimal 500 karakter";
      isValid = false;
    }
    
    // Validate price (numeric and > 0)
    if (!formData.price) {
      newErrors.price = "Harga harus diisi";
      isValid = false;
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Harga harus berupa angka positif";
      isValid = false;
    }
    
    // Validate image (required for new destinations)
    if (!editingId && !formData.image) {
      newErrors.image = "Gambar harus diupload";
      isValid = false;
    }
    
    setFormErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    const isSuccess = editingId
      ? await updateDestination(editingId, formData)
      : await addDestination(formData);

    if (isSuccess) {
      setModalOpen(false);
      resetForm();
    }
  };

  const handleEdit = (destination) => {
    setEditingId(destination.id);
    setFormData({
      name: destination.name,
      location: destination.location,
      description: destination.description,
      price: destination.price,
      image: null,
    });
    
    // Set image preview if available
    if (destination.image_url) {
      setImagePreview(destination.image_url);
    } else if (destination.image) {
      setImagePreview(`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${destination.image}`);
    }
    
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Yakin ingin menghapus destinasi ini?")) {
      await deleteDestination(id);
    }
  };

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(clearMessages, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Format price to currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <div className="ml-64 p-6 space-y-6">
        <Header title="Destinations" />

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Destinations</h1>
                <button
                  onClick={() => {
                    resetForm();
                    setModalOpen(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Tambah Destinasi
                </button>
              </div>

              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                  <p>{error}</p>
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded">
                  <p>{success}</p>
                </div>
              )}

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {destinations?.length > 0 ? (
                        destinations.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {item.image ? (
                                <img
                                  src={item.image_url || `${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/${item.image}`}
                                  alt={item.name}
                                  className="w-20 h-14 object-cover rounded-lg shadow"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder-image.jpg";
                                  }}
                                />
                              ) : (
                                <span className="text-gray-400">No image</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{item.location}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">{item.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{formatPrice(item.price)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-indigo-600 hover:text-indigo-900 mr-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Hapus
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                            Tidak ada data destinasi
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 overflow-y-auto z-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen">
            {/* Overlay */}
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setModalOpen(false)}></div>
            
            {/* Modal content */}
            <div className="relative bg-white rounded-lg shadow-xl mx-4 w-full max-w-4xl">
              <div className="bg-white px-6 pt-5 pb-6 rounded-t-lg border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                    {editingId ? "Edit Destination" : "Tambah Destination"}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setModalOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      {/* Name Field */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Nama Destinasi <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="name"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className={`block w-full rounded-md border ${formErrors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm py-2 px-3 focus:outline-none focus:ring-2 sm:text-sm`}
                            placeholder="Masukkan nama destinasi (3-50 karakter)"
                          />
                          {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                          <p className="mt-1 text-xs text-gray-500">
                            {formData.name.length}/50 karakter
                          </p>
                        </div>
                      </div>
                      
                      {/* Location Field */}
                      <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                          Lokasi <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="location"
                            id="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className={`block w-full rounded-md border ${formErrors.location ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm py-2 px-3 focus:outline-none focus:ring-2 sm:text-sm`}
                            placeholder="Masukkan lokasi destinasi (3-100 karakter)"
                          />
                          {formErrors.location && <p className="mt-1 text-sm text-red-600">{formErrors.location}</p>}
                          <p className="mt-1 text-xs text-gray-500">
                            {formData.location.length}/100 karakter
                          </p>
                        </div>
                      </div>
                      
                      {/* Price Field */}
                      <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                          Harga (Rp) <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">Rp</span>
                          </div>
                          <input
                            type="text"
                            name="price"
                            id="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className={`block w-full rounded-md border ${formErrors.price ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm pl-12 py-2 px-3 focus:outline-none focus:ring-2 sm:text-sm`}
                            placeholder="0"
                            inputMode="numeric"
                            pattern="[0-9]*"
                          />
                        </div>
                        {formErrors.price && <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>}
                        <p className="mt-1 text-xs text-gray-500">
                          Masukkan harga dalam Rupiah tanpa titik atau koma
                        </p>
                      </div>
                      
                      {/* Image Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Gambar {!editingId && <span className="text-red-500">*</span>}
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                          <div className="space-y-1 text-center">
                            {imagePreview ? (
                              <div className="mb-3">
                                <img 
                                  src={imagePreview} 
                                  alt="Preview" 
                                  className="mx-auto h-32 w-auto rounded-md"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setImagePreview(null);
                                    setFormData(prev => ({ ...prev, image: null }));
                                  }}
                                  className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
                                >
                                  Hapus gambar
                                </button>
                              </div>
                            ) : (
                              <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                stroke="currentColor"
                                fill="none"
                                viewBox="0 0 48 48"
                                aria-hidden="true"
                              >
                                <path
                                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                  strokeWidth={2}
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                            <div className="flex justify-center text-sm text-gray-600">
                              <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                              >
                                <span>Upload gambar</span>
                                <input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={handleImageChange}
                                />
                              </label>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                          </div>
                        </div>
                        {formErrors.image && <p className="mt-1 text-sm text-red-600">{formErrors.image}</p>}
                      </div>
                    </div>
                    
                    <div>
                      {/* Description Field */}
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Deskripsi <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1">
                          <textarea
                            name="description"
                            id="description"
                            rows={11}
                            value={formData.description}
                            onChange={handleInputChange}
                            className={`block w-full rounded-md border ${formErrors.description ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'} shadow-sm py-2 px-3 focus:outline-none focus:ring-2 sm:text-sm`}
                            placeholder="Masukkan deskripsi destinasi (10-500 karakter)"
                          />
                          {formErrors.description && <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
                          <p className="mt-1 text-xs text-gray-500">
                            {formData.description.length}/500 karakter
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      {loading ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : null}
                      {editingId ? "Perbarui" : "Simpan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Destinations;