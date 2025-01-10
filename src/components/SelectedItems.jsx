import PropTypes from 'prop-types';

const SelectedItems = ({
  selectedItems,
  addItemToBill,
  removeItemFromBill,
  // deleteItemFromBill,
  calculateTotal,
  updateSelectedItems,
}) => {
  const { total, savings } = calculateTotal(selectedItems);

  const handleAddonChange = (itemKey, newAddon) => {
    const updatedItems = selectedItems.map((item) => {
      if (item.key === itemKey) {
        const oldAddonPrice = item.addon ? item.addon.price : 0;
        return {
          ...item,
          addon: newAddon,
          price: item.price - oldAddonPrice + newAddon.price,
        };
      }
      return item;
    });
    updateSelectedItems(updatedItems);
  };

  return (
    <div className="w-full lg:w-1/4 lg:pl-4 bg-gray-50 p-6 rounded-lg shadow-inner">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Selected Items
      </h2>
      {selectedItems.length > 0 ? (
        <ul>
          {selectedItems.map((item) => (
            <li key={item.key} className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span>
                  {item.name} {item.option ? `- ${item.option}` : ''} (x
                  {item.quantity})
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <div className="flex items-center">
                  <button
                    onClick={() =>
                      addItemToBill(item, {
                        name: item.option,
                        price: item.price,
                      })
                    }
                    className="ml-4 bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItemFromBill(item)}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                  >
                    -
                  </button>
                  {/* <button
                    onClick={() => deleteItemFromBill(item)}
                    className="ml-2 bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 transition"
                  >
                    Remove
                  </button> */}
                </div>
              </div>
              {item.type === 'salad' && (
                <div className="flex flex-col">
                  <label className="mb-2 text-sm font-semibold text-gray-700">
                    Additions:
                  </label>
                  <select
                    onChange={(e) =>
                      handleAddonChange(item.key, JSON.parse(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-300"
                  >
                    <option disabled value="">
                      Addition
                    </option>
                    {[
                      { name: 'No Addition', price: 0.0 },
                      { name: 'Grilled Chicken', price: 4.0 },
                      { name: 'Pepper Chicken', price: 4.0 },
                      { name: 'Crispy Chicken', price: 4.0 },
                      { name: 'Seafood', price: 4.0 },
                      { name: 'Donair', price: 4.0 },
                    ].map((protein, i) => (
                      <option key={i} value={JSON.stringify(protein)}>
                        {protein.name} - ${protein.price.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {item.type === 'pasta' && (
                <div className="flex flex-col mt-4">
                  <label className="mb-2 text-sm font-semibold text-gray-700">
                    Add Meatballs:
                  </label>
                  <select
                    onChange={(e) =>
                      handleAddonChange(item.key, JSON.parse(e.target.value))
                    }
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-300"
                  >
                    <option disabled value="">
                      Select an addon
                    </option>
                    {[
                      { name: 'No Addition', price: 0.0 },
                      { name: 'Meatballs', price: 4.0 },
                    ].map((addon, i) => (
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
        <p className="text-gray-600">No items selected.</p>
      )}
      <div className="mt-6 text-2xl font-bold text-gray-900">
        Total: ${total}
      </div>
      {savings > 0 && (
        <div className="mt-2 text-lg font-semibold text-green-600">
          Great! You saved ${savings} by ordering multiple sets of wings!
        </div>
      )}
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
