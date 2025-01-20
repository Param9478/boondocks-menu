import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';

const MenuItem = ({
  item,
  addItemToBill,
  removeItemFromBill,
  deleteItemFromBill,
  getItemQuantity,
}) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const itemKey = selectedSize
    ? `${item.name}-${selectedSize?.name}`
    : item.name;

  const quantity = getItemQuantity(itemKey);

  const handleSizeChange = (e) => {
    const size = JSON.parse(e.target.value);
    setSelectedSize(size);
    addItemToBill(item, size);
  };

  const handleToppingChange = (e) => {
    const topping = e.target.value;
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((t) => t !== topping)
        : [...prev, topping].slice(0, 4)
    );
  };

  const handleAddToCart = () => {
    const priceWithToppings =
      selectedSize ? selectedSize.price + Math.max(0, selectedToppings.length - 4) : item.price;
    addItemToBill(
      { ...item, price: priceWithToppings },
      selectedSize ? { size: selectedSize, toppings: selectedToppings } : null
    );
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg hover:shadow-2xl transition-shadow bg-white">
      <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
      <p className="text-gray-700 mt-2">
        {item.description || 'No description available.'}
      </p>
      {item.options && (
        <select
          onChange={handleSizeChange}
          className="mt-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-300"
        >
          <option value="">Select an option</option>
          {item.options.map((option, i) => (
            <option key={i} value={JSON.stringify(option)}>
              {option.name} - ${option.price?.toFixed(2)}
            </option>
          ))}
        </select>
      )}
      {item.sizes && (
        <select
          onChange={handleSizeChange}
          className="mt-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-300"
        >
          <option value="">Select a size</option>
          {item.sizes.map((size, i) => (
            <option key={i} value={JSON.stringify(size)}>
              {size.name} - ${size.price?.toFixed(2)}
            </option>
          ))}
        </select>
      )}
      {item.toppings && (
        <div className="mt-4">
          <label className="text-gray-700">Select Toppings (Up to 4):</label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {item.toppings.map((topping, i) => (
              <div key={i} className="flex items-center">
                <input
                  type="checkbox"
                  value={topping}
                  onChange={handleToppingChange}
                  className="mr-2"
                  checked={selectedToppings.includes(topping)}
                />
                <label className="text-gray-700">{topping}</label>
              </div>
            ))}
          </div>
          {selectedToppings.length > 4 && (
            <p className="text-gray-700 mt-2">
              Additional toppings cost $1 each.
            </p>
          )}
        </div>
      )}
      {!item.sizes && !item.toppings && !item.options && (
        <p className="text-gray-900 font-bold mt-4">${item.price}</p>
      )}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {quantity > 0 ? (
            <>
              <button
                onClick={() =>
                  removeItemFromBill({ name: item.name, key: itemKey })
                }
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition transform hover:scale-110"
              >
                <FaMinus />
              </button>
              <span className="text-lg font-semibold text-gray-900">
                {quantity}
              </span>
              <button
                onClick={handleAddToCart}
                className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition transform hover:scale-110"
              >
                <FaPlus />
              </button>
              <button
                onClick={() =>
                  deleteItemFromBill({ name: item.name, key: itemKey })
                }
                className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition transform hover:scale-110"
              >
                <FaTrashAlt />
              </button>
            </>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`text-white px-4 py-2 rounded-md transition ${
                (item.sizes && !selectedSize) || (item.options && !selectedSize)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={(item.sizes && !selectedSize) || (item.options && !selectedSize)}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

MenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  addItemToBill: PropTypes.func.isRequired,
  removeItemFromBill: PropTypes.func.isRequired,
  deleteItemFromBill: PropTypes.func.isRequired,
  getItemQuantity: PropTypes.func.isRequired,
};

export default MenuItem;
