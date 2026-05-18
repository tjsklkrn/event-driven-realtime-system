const db = require('../db/database');

const getOrders = async (req, res) => {

  try {

    const result = await db.query(
      'SELECT * FROM orders ORDER BY id DESC'
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to fetch orders',
    });
  }
};

const createOrder = async (req, res) => {

  try {

    const {
      customer_name,
      product_name,
      status,
    } = req.body;

    const result = await db.query(
      `
      INSERT INTO orders (
        customer_name,
        product_name,
        status
      )
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [
        customer_name,
        product_name,
        status,
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to create order',
    });
  }
};

const updateOrder = async (req, res) => {

  try {

    const { id } = req.params;

    const { status } = req.body;

    const result = await db.query(
      `
      UPDATE orders
      SET status = $1
      WHERE id = $2
      RETURNING *
      `,
      [status, id]
    );

    res.json(result.rows[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to update order',
    });
  }
};

const deleteOrder = async (req, res) => {

  try {

    const { id } = req.params;

    await db.query(
      `
      DELETE FROM orders
      WHERE id = $1
      `,
      [id]
    );

    res.json({
      message: 'Order deleted successfully',
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: 'Failed to delete order',
    });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};