import PropTypes from 'prop-types';
import { FaPlus, FaMinus, FaTrashAlt } from 'react-icons/fa';
import RenderReceipt from './RenderReceipt'; // Import the new RenderReceipt component

const SelectedItems = ({
  selectedItems,
  addItemToBill,
  removeItemFromBill,
  deleteItemFromBill,
  calculateTotal,
  handleCheckout,
  showReceipt,
  updateSelectedItems,
  setShowReceipt,
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
    if (
      item?.options?.some(
        (option) => option.name === 'With Side' && item.option === 'With Side'
      )
    ) {
      return [
        { name: 'Fries', price: 0 },
        { name: 'Caesar Salad, Cactus Cut Potatoes, or Onion Rings', price: 2 },
        { name: 'Poutine, Greek Salad, or Fattoush Salad', price: 4 },
        { name: 'No Side', price: -5 },
      ];
    }
    return [];
  };

  return (
    <div className="w-full lg:w-2/5 xl:w-1/3 bg-gray-50 p-6 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold text-blue-900 mb-6 text-center">
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
              {item.option === 'With Side' && (
                <div className="w-full mt-2">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Add Side:
                  </label>
                  <select
                    onChange={(e) =>
                      handleAddonChange(item.key, JSON.parse(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 transition ease-in-out w-full"
                  >
                    <option value="">Select a side</option>
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
      <div className="mt-8 p-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-md border border-blue-300">
        <div className="flex justify-between items-center text-xl font-bold text-blue-700">
          <span>Total:</span>
          <span className="text-blue-900">${total}</span>
        </div>

        {savings > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md text-blue-700">
            <p className="text-base font-medium">
              🎉 Great! You saved{' '}
              <span className="font-semibold">${savings.toFixed(2)}</span>
              by ordering multiple sets of wings!
            </p>
          </div>
        )}
      </div>

      {/* Render Receipt */}
      {showReceipt && (
        <RenderReceipt
          total={total}
          savings={savings}
          selectedItems={selectedItems}
        />
      )}
      {/* Clear All Button */}
      <div className="mt-8 text-center">
        {(selectedItems.length > 0 || total > 0) && (
          <div className="mt-6 flex flex-col items-center space-y-4">
            {/* Receipt Button */}
            <button
              onClick={() => setShowReceipt(!showReceipt)}
              className="bg-blue-600 text-white p-4 w-full md:w-64 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              {!showReceipt ? 'Show Receipt' : 'Hide Receipt'}
            </button>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              className="bg-blue-600 text-white p-4 w-full md:w-64 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
            >
              Checkout
            </button>
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
  handleCheckout: PropTypes.func.isRequired,
  showReceipt: PropTypes.bool.isRequired,
  setShowReceipt: PropTypes.func.isRequired,
};

export default SelectedItems;
