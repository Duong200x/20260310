async function runTest() {
  console.log("=== BẮT ĐẦU TEST NHƯ POSTMAN ===");
  try {
    // 1. Tạo Category
    console.log("\n[1] Đang gửi POST request tạo Category...");
    const catResponse = await fetch('http://127.0.0.1:3000/api/v1/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: "Laptop Gaming " + Date.now(),
        description: "Các dòng laptop hiệu năng cao"
      })
    });
    
    const catData = await catResponse.json();
    if (!catResponse.ok) throw new Error(catData.message || 'Lỗi tạo category');
    
    console.log("-> Thành công! Kết quả trả về:");
    console.log(catData);
    
    const categoryId = catData._id;
    
    // 2. Tạo Product
    console.log(`\n[2] Đang gửi POST request tạo Product, truyền ID vào field category: ${categoryId}...`);
    const prodResponse = await fetch('http://127.0.0.1:3000/api/v1/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: "SamSUnfdf gamixy " + Date.now(),
        price: 45000000,
        description: "Tung Quoc",
        category: categoryId
      })
    });
    
    const prodData = await prodResponse.json();
    if (!prodResponse.ok) throw new Error(prodData.message || 'Lỗi tạo product');
    
    console.log("-> Thành công! Dữ liệu Product vừa tạo (đã liên kết Category):");
    console.log(prodData);
    
    // 3. Đọc dữ liệu Product để check populate
    console.log(`\n[3] Kiểm tra GET request để xem category có được populate không...`);
    const getResponse = await fetch(`http://127.0.0.1:3000/api/v1/products/${prodData._id}`);
    const getData = await getResponse.json();
    console.log("-> Thông tin sản phẩm chi tiết lấy từ GET:");
    console.log(getData);
    console.log("\n=== HOÀN TẤT TEST ===");
  } catch (error) {
    console.error("LỖI:", error.message);
  }
}

runTest();
