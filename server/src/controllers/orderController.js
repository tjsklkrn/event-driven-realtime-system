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

    if (
      !customer_name ||
      !product_name ||
      !status
    ) {

      return res.status(400).json({
        error:
          'customer_name, product_name and status are required',
      });
    }

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

    const {
      customer_name,
      product_name,
      status,
    } = req.body;

    const result = await db.query(
      `
      UPDATE orders
      SET
        customer_name = COALESCE($1, customer_name),
        product_name = COALESCE($2, product_name),
        status = COALESCE($3, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
      `,
      [
        customer_name,
        product_name,
        status,
        id,
      ]
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