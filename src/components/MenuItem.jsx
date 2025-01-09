import PropTypes from 'prop-types';

const MenuItem = ({
  item,
  selectedOptions,
  setSelectedOptions,
  addItemToBill,
  removeItemFromBill,
  getItemQuantity,
}) => {
  const itemKey = item.options
    ? `${item.name}-${selectedOptions[item.name]?.name}`
    : item.name;

  const quantity = getItemQuantity(itemKey);

  return (
    <div className="p-6 border border-gray-300 rounded-lg hover:shadow-2xl transition-shadow bg-white">
      <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
      <p className="text-gray-700 mt-2">
        {item.description || 'No description available.'}
      </p>
      {item.options ? (
        <select
          onChange={(e) => {
            const selectedOption = JSON.parse(e.target.value);
            setSelectedOptions({
              ...selectedOptions,
              [item.name]: selectedOption,
            });
            addItemToBill(item, selectedOption); // Add item to cart when option is selected
          }}
          className="mt-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-300"
        >
          <option value="">Select an option</option>
          {item.options.map((option, i) => (
            <option key={i} value={JSON.stringify(option)}>
              {option.name} - ${option.price.toFixed(2)}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-gray-900 font-bold mt-4">${item.price.toFixed(2)}</p>
      )}
      {quantity > 0 ? (
        <div className="mt-4 flex items-center">
          <button
            onClick={() =>
              removeItemFromBill({ name: item.name, key: itemKey })
            }
            className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
          >
            -
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            onClick={() => addItemToBill(item, selectedOptions[item.name])}
            className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition"
          >
            +
          </button>
        </div>
      ) : (
        <div className="mt-4 flex items-center">
          <button
            onClick={() => addItemToBill(item, selectedOptions[item.name])}
            className={`text-white px-2 py-1 rounded-md transition ${
              item.options && !selectedOptions[item.name]
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600'
            }`}
            disabled={item.options && !selectedOptions[item.name]}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
};

MenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
  addItemToBill: PropTypes.func.isRequired,
  removeItemFromBill: PropTypes.func.isRequired,
  getItemQuantity: PropTypes.func.isRequired,
};

export default MenuItem;
