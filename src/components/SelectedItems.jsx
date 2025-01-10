import PropTypes from 'prop-types';
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';

const SelectedItems = ({
  selectedItems,
  addItemToBill,
  removeItemFromBill,
  deleteItemFromBill,
  calculateTotal,
  updateSelectedItems,
}) => {
  const { total, savings } = calculateTotal(selectedItems);

  const handleAddonChange = (itemKey, newAddon) => {
    const updatedItems = selectedItems.map((item) =>
      item.key === itemKey
        ? {
            ...item,
            addon: newAddon,
            price: item.price - (item.addon?.price || 0) + newAddon.price,
          }
        : item
    );
    updateSelectedItems(updatedItems);
  };

  const renderAddons = (item) => {
    if (item.type === 'salad') {
      return [
        { name: 'No Addition', price: 0 },
        { name: 'Grilled Chicken', price: 4 },
        { name: 'Pepper Chicken', price: 4 },
        { name: 'Crispy Chicken', price: 4 },
        { name: 'Seafood', price: 4 },
        { name: 'Donair', price: 4 },
      ];
    } else if (item.type === 'pasta') {
      return [
        { name: 'No Addition', price: 0 },
        { name: 'Meatballs', price: 4 },
      ];
    }
    return [];
  };

  const clearAllItems = () => {
    updateSelectedItems([]);
  };

  const handleCheckout = () => {
    // Scroll to the top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    clearAllItems();
  };

  return (
    <div className="w-full lg:w-2/5 xl:w-1/3 bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-teal-800 mb-6 text-center">
        Selected Items
      </h2>
      {selectedItems.length > 0 ? (
        <ul className="space-y-6">
          {selectedItems.map((item) => (
            <li
              key={item.key}
              className="p-3 bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col gap-4"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <span className="text-lg font-medium text-gray-700 block">
                    {item.name} {item.option ? `- ${item.option}` : ''} (x
                    {item.quantity})
                  </span>
                  <span className="text-xl font-semibold text-gray-900 block">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() =>
                      addItemToBill(
                        { ...item, key: item.key },
                        item.option
                          ? { name: item.option, price: item.price }
                          : null
                      )
                    }
                    className="bg-green-500 text-white p-3 rounded-full hover:bg-green-600 transition transform hover:scale-110"
                  >
                    <FaPlus />
                  </button>
                  <button
                    onClick={() => removeItemFromBill(item)}
                    className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition transform hover:scale-110"
                  >
                    <FaMinus />
                  </button>
                  <button
                    onClick={() => deleteItemFromBill(item)}
                    className="bg-gray-500 text-white p-3 rounded-full hover:bg-gray-600 transition transform hover:scale-110"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>

              {/* Addons */}
              {renderAddons(item).length > 0 && (
                <div className="w-full mt-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    {item.type === 'salad' ? 'Add Protein:' : 'Add Meatballs:'}
                  </label>
                  <select
                    onChange={(e) =>
                      handleAddonChange(item.key, JSON.parse(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-teal-300 transition ease-in-out w-full"
                  >
                    <option disabled value="">
                      Select an addition
                    </option>
                    {renderAddons(item).map((addon, i) => (
                      <option key={i} value={JSON.stringify(addon)}>
                        {addon.name} - ${addon.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">No items selected.</p>
      )}

      {/* Total and Savings */}
      <div className="mt-8 p-6 bg-gradient-to-r from-teal-100 to-teal-200 rounded-lg shadow-md border border-teal-300">
        <div className="flex justify-between items-center text-xl font-bold text-teal-700">
          <span>Total:</span>
          <span className="text-teal-900">${total}</span>
        </div>

        {savings > 0 && (
          <div className="mt-4 p-4 bg-teal-50 border-l-4 border-teal-400 rounded-md text-teal-700">
            <p className="text-base font-medium">
              🎉 Great! You saved{' '}
              <span className="font-semibold">${savings.toFixed(2)}</span>
              by ordering multiple sets of wings!
            </p>
          </div>
        )}
      </div>
      {/* Clear All Button */}
      <div className="mt-6 text-center">
        {(selectedItems.length > 0 || total > 0) && (
          <div className="mt-6 text-center">
            {(selectedItems.length > 0 || total > 0) && (
              <button
                onClick={handleCheckout}
                className="bg-teal-600 text-white p-4 rounded-lg hover:bg-teal-700 transition"
              >
                Checkout
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SelectedItems.propTypes = {
  selectedItems: PropTypes.array.isRequired,
  addItemToBill: PropTypes.func.isRequired,
  removeItemFromBill: PropTypes.func.isRequired,
  deleteItemFromBill: PropTypes.func.isRequired,
  calculateTotal: PropTypes.func.isRequired,
  updateSelectedItems: PropTypes.func.isRequired,
};

export default SelectedItems;
