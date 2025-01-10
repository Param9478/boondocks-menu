import PropTypes from 'prop-types';
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';

const MenuItem = ({
  item,
  selectedOptions,
  setSelectedOptions,
  addItemToBill,
  removeItemFromBill,
  deleteItemFromBill,
  getItemQuantity,
}) => {
  const itemKey = item.options
    ? `${item.name}-${selectedOptions[item.name]?.name}`
    : item.name;

  const quantity = getItemQuantity(itemKey);

  const handleOptionChange = (e) => {
    const selectedOption = JSON.parse(e.target.value);
    setSelectedOptions((prev) => ({
      ...prev,
      [item.name]: selectedOption,
    }));
    addItemToBill(item, selectedOption);
  };

  const handleAddToCart = () => {
    addItemToBill(item, selectedOptions[item.name]);
  };

  return (
    <div className="p-6 border border-gray-200 rounded-lg hover:shadow-2xl transition-shadow bg-white">
      <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
      <p className="text-gray-700 mt-2">
        {item.description || 'No description available.'}
      </p>
      {item.options && (
        <select
          onChange={handleOptionChange}
          className="mt-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-300"
        >
          <option value="">Select an option</option>
          {item.options.map((option, i) => (
            <option key={i} value={JSON.stringify(option)}>
              {option.name} - ${option.price.toFixed(2)}
            </option>
          ))}
        </select>
      )}
      {!item.options && (
        <p className="text-gray-900 font-bold mt-4">${item.price.toFixed(2)}</p>
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
            </>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`text-white px-4 py-2 rounded-md transition ${
                item.options && !selectedOptions[item.name]
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              disabled={item.options && !selectedOptions[item.name]}
            >
              Add to Cart
            </button>
          )}
        </div>
        <button
          onClick={() => deleteItemFromBill({ name: item.name, key: itemKey })}
          className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition transform hover:scale-110"
        >
          <FaTrashAlt />
        </button>
      </div>
    </div>
  );
};

MenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
  addItemToBill: PropTypes.func.isRequired,
  removeItemFromBill: PropTypes.func.isRequired,
  deleteItemFromBill: PropTypes.func.isRequired,
  getItemQuantity: PropTypes.func.isRequired,
};

export default MenuItem;
