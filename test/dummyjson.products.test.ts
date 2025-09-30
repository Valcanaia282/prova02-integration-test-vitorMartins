import { spec } from 'pactum';

describe('DummyJSON API Test Scenarios', () => {
  const baseUrl = 'https://dummyjson.com';

  it('Obter todos os produtos', async () => {
    await spec()
      .get(`${baseUrl}/products`)
      .expectStatus(200)
      .expectJsonLike({
        products: []
      });
  });

  it('Obter um único produto por ID', async () => {
    await spec()
      .get(`${baseUrl}/products/1`)
      .expectStatus(200)
      .expectJsonLike({ id: 1 });
  });


  it('Pesquisar produtos por termo', async () => {
    const res = await spec()
      .get(`${baseUrl}/products/search?q=laptop`)
      .expectStatus(200);

    const hasLaptop = res.body.products.some((p) => p.title.includes('Laptop'));
    if (!hasLaptop) throw new Error("Nenhum produto com 'Laptop' encontrado");
  });

  it('Adicionar um novo produto', async () => {
    const newProduct = { title: 'Test Product', description: 'This is a test product.' };
    const res = await spec()
      .post(`${baseUrl}/products/add`)
      .withHeaders('Content-Type', 'application/json')
      .withJson(newProduct)
      .expectStatus(201)
      .expectJsonLike(newProduct);

    if (typeof res.body.id !== 'number' || res.body.id <= 0) {
      throw new Error("ID inválido no retorno do produto criado");
    }
  });

  it('Atualizar um produto existente', async () => {
    const updatedTitle = 'Updated Test Product';
    await spec()
      .put(`${baseUrl}/products/1`)
      .withHeaders('Content-Type', 'application/json')
      .withJson({ title: updatedTitle })
      .expectStatus(200)
      .expectJsonLike({ id: 1, title: updatedTitle });
  });

  it('Deletar um produto', async () => {
    await spec()
      .delete(`${baseUrl}/products/1`)
      .expectStatus(200)
      .expectJsonLike({ id: 1, isDeleted: true });
  });

  it('Obter todos os usuários', async () => {
    await spec()
      .get(`${baseUrl}/users`)
      .expectStatus(200)
      .expectJsonLike({
        users: []
      });
  });

  it('Obter um único usuário por ID', async () => {
    await spec()
      .get(`${baseUrl}/users/1`)
      .expectStatus(200)
      .expectJsonLike({ id: 1 });
  });

  it('Adicionar um novo usuário', async () => {
    const newUser = { firstName: 'John', lastName: 'Doe', age: 30 };
    const res = await spec()
      .post(`${baseUrl}/users/add`)
      .withHeaders('Content-Type', 'application/json')
      .withJson(newUser)
      .expectStatus(201)
      .expectJsonLike(newUser);

    if (typeof res.body.id !== 'number' || res.body.id <= 0) {
      throw new Error("ID inválido no retorno do usuário criado");
    }
  });

  it('Obter todos os posts', async () => {
    await spec()
      .get(`${baseUrl}/posts`)
      .expectStatus(200)
      .expectJsonLike({
        posts: []
      });
  });
});
