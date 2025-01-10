import PropTypes from 'prop-types';
import { useState } from 'react';

const MenuItem = ({
  item,
  selectedOptions,
  setSelectedOptions,
  addItemToBill,
  removeItemFromBill,
  getItemQuantity,
}) => {
  const [proteinOption, setProteinOption] = useState('');

  const itemKey = item.options
    ? `${item.name}-${selectedOptions[item.name]?.name}`
    : item.name;

  const quantity = getItemQuantity(itemKey);

  const handleAddToCart = () => {
    const selectedOption = selectedOptions[item.name];
    if (selectedOption) {
      let option = { ...selectedOption };
      if (proteinOption) {
        option.protein = proteinOption;
        option.price += 4.0; // Add the price for protein
      }
      addItemToBill(item, option);
    } else {
      addItemToBill(item, { name: item.name, price: item.price });
    }
  };

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
      {item.category === 'Salads' && (
        <select
          onChange={(e) => setProteinOption(e.target.value)}
          className="mt-4 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-300"
        >
          <option value="">Select a protein</option>
          {item.proteins.map((protein, i) => (
            <option key={i} value={protein.name}>
              {protein.name} - ${protein.price.toFixed(2)}
            </option>
          ))}
        </select>
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
            onClick={handleAddToCart}
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
