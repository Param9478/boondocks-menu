import PropTypes from 'prop-types';
import GravyDip from './GravyDip';

const SelectedItems = ({
  selectedItems,
  addItemToBill,
  removeItemFromBill,
  deleteItemFromBill,
  gravyDipOptions,
  setGravyDipOptions,
  calculateTotal,
}) => {
  const { total, savings } = calculateTotal(selectedItems, gravyDipOptions);

  const updateTotal = (newGravyDipOptions) => {
    setGravyDipOptions(newGravyDipOptions);
    calculateTotal(selectedItems, newGravyDipOptions);
  };

  return (
    <div className="w-full lg:w-1/4 lg:pl-4 bg-gray-50 p-6 rounded-lg shadow-inner">
      <h2 className="text-3xl font-semibold text-gray-800 mb-4">
        Selected Items
      </h2>
      {selectedItems.length > 0 ? (
        <ul>
          {selectedItems.map((item) => (
            <li
              key={item.key}
              className="mb-2 flex justify-between items-center"
            >
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
                <button
                  onClick={() => deleteItemFromBill(item)}
                  className="ml-2 bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 transition"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600">No items selected.</p>
      )}
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Add Gravy or Dip
        </h3>
        <GravyDip
          itemKey="default"
          gravyDipOptions={gravyDipOptions}
          setGravyDipOptions={setGravyDipOptions}
          updateTotal={updateTotal}
        />
      </div>
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
  gravyDipOptions: PropTypes.object.isRequired,
  setGravyDipOptions: PropTypes.func.isRequired,
  calculateTotal: PropTypes.func.isRequired,
};

export default SelectedItems;
