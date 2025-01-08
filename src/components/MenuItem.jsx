import PropTypes from 'prop-types';

const MenuItem = ({
  item,
  selectedOptions,
  setSelectedOptions,
  addItemToBill,
  removeItemFromBill,
  getItemQuantity,
}) => (
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
          addItemToBill(item, selectedOption);
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
    {item.options && selectedOptions[item.name] && (
      <div className="mt-4 flex items-center">
        <button
          onClick={() =>
            removeItemFromBill({
              name: item.name,
              key: `${item.name}-${selectedOptions[item.name].name}`,
            })
          }
          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
        >
          -
        </button>
        <span className="mx-2">
          {getItemQuantity(`${item.name}-${selectedOptions[item.name].name}`)}
        </span>
        <button
          onClick={() => addItemToBill(item, selectedOptions[item.name])}
          className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition"
        >
          +
        </button>
      </div>
    )}
    {!item.options && (
      <div className="mt-4 flex items-center">
        <button
          onClick={() =>
            removeItemFromBill({ name: item.name, key: item.name })
          }
          className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
        >
          -
        </button>
        <span className="mx-2">{getItemQuantity(item.name)}</span>
        <button
          onClick={() => addItemToBill(item)}
          className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition"
        >
          +
        </button>
      </div>
    )}
  </div>
);

MenuItem.propTypes = {
  item: PropTypes.object.isRequired,
  selectedOptions: PropTypes.object.isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
  addItemToBill: PropTypes.func.isRequired,
  removeItemFromBill: PropTypes.func.isRequired,
  getItemQuantity: PropTypes.func.isRequired,
};

export default MenuItem;
