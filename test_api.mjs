async function testDelete() {
  try {
    const res = await fetch('http://localhost:5023/api/product');
    const products = await res.json();
    console.log('Products:', products.length);
    if (products.length > 0) {
      const id = products[0].productId || products[0].ProductId;
      console.log('Attempting to delete product:', id);
      const delRes = await fetch(`http://localhost:5023/api/product/${id}`, {
        method: 'DELETE'
      });
      console.log('Delete status:', delRes.status);
      const delBody = await delRes.text();
      console.log('Delete response:', delBody);
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

testDelete();
