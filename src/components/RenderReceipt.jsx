import PropTypes from 'prop-types';
import './style.css';

const RenderReceipt = ({ total, savings, selectedItems }) => {
  const formatPrice = (price) => `$${price}`;

  const handlePrint = () => {
    window.print(); // Open the print dialog
  };

  return (
    <div className="receipt-container mt-8 p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">
        Receipt
      </h3>

      <ul className="space-y-4">
        {selectedItems.map((item) => (
          <li
            key={item.key}
            className="flex justify-between items-center text-lg font-medium text-gray-700"
          >
            <span>
              {item.name} {item.option ? `- ${item.option}` : ''} (x
              {item.quantity})
              {item.addon && (
                <span className="text-sm text-gray-600">
                  {' '}
                  - Addon: {item.addon.name}
                </span>
              )}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg shadow-md text-blue-700">
        <div className="flex justify-between text-xl font-bold">
          <span>Total Before Savings:</span>
          <span>{formatPrice(total)}</span>
        </div>

        {savings > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-md text-blue-700">
            <p className="text-base font-medium">
              🎉 Great! You saved{' '}
              <span className="font-semibold">{formatPrice(savings)}</span> by
              ordering multiple sets of wings!
            </p>
          </div>
        )}

        <div className="mt-4 flex justify-between text-xl font-bold">
          <span>Final Total:</span>
          <span>{formatPrice(total - savings)}</span>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">Thank you for your order!</p>
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white p-4 w-full md:w-64 rounded-lg hover:bg-blue-700 transition"
        >
          Print Receipt
        </button>
      </div>
    </div>
  );
};

RenderReceipt.propTypes = {
  total: PropTypes.string.isRequired,
  savings: PropTypes.number.isRequired,
  selectedItems: PropTypes.array.isRequired,
};

export default RenderReceipt;
