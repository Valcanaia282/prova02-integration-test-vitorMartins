import { spec } from 'pactum';

describe('Dummyjson Products API', () => {
  const baseUrl = 'https://dummyjson.com';

  it('should get all products', async () => {
    await spec()
      .get(`${baseUrl}/products`)
      .expectStatus(200)
      .expectJsonLike({
        products: []
      });
  });

  it('should get a single product', async () => {
    await spec()
      .get(`${baseUrl}/products/1`)
      .expectStatus(200)
      .expectJsonLike({ id: 1 });
  });

  it('should search products', async () => {
    const res = await spec()
      .get(`${baseUrl}/products/search?q=phone`)
      .expectStatus(200);

    const hasIphone = res.body.products.some((p: any) => p.title.includes('iPhone'));
    if (!hasIphone) throw new Error("Nenhum produto com 'iPhone' encontrado");
  });

  it('should add a new product (POST)', async () => {
    const res = await spec()
      .post(`${baseUrl}/products/add`)
      .withHeaders('Content-Type', 'application/json')
      .withJson({ title: 'BMW Pencil' })
      .expectStatus(201)
      .expectJsonLike({ title: 'BMW Pencil' });

    if (typeof res.body.id !== 'number' || res.body.id <= 0) {
      throw new Error("ID inválido no retorno do produto criado");
    }
  });

  it('should update a product (PUT)', async () => {
    await spec()
      .put(`${baseUrl}/products/1`)
      .withHeaders('Content-Type', 'application/json')
      .withJson({ title: 'iPhone Galaxy +1' })
      .expectStatus(200)
      .expectJsonLike({ id: 1, title: 'iPhone Galaxy +1' });
  });

  it('should delete a product (DELETE)', async () => {
    await spec()
      .delete(`${baseUrl}/products/1`)
      .expectStatus(200)
      .expectJsonLike({ id: 1, isDeleted: true });
  });
});
