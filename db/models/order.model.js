const { Model, DataTypes, Sequelize } = require("sequelize");
const { CUSTOMER_TABLE } = require("./customer.model");


const ORDER_TABLE = 'orders';

const OrderSchema= {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  status: {
    allowNull: false,
    type: DataTypes.STRING
  },
  comments: {
    allowNull: true,
    type: DataTypes.STRING
  },

  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: Sequelize.NOW
  },
  customerId: {
    field: "customer_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
        model: CUSTOMER_TABLE,
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
  }
}

class Order extends Model{
  static associate(models){
    this.belongsTo(models.Customer, {
      as: 'customer',
    })
  }
  static config(sequelize) {
    return{
      sequelize,
      tableName: ORDER_TABLE,
      modelName: "Order",
      timestamps: false
    }
  }
}

module.exports = { OrderSchema, ORDER_TABLE, Order }
