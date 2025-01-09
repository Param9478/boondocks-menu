import PropTypes from 'prop-types';

const GravyDip = ({
  itemKey,
  gravyDipOptions,
  setGravyDipOptions,
  updateTotal,
}) => {
  const handleAddGravyDip = () => {
    const newCount = (gravyDipOptions[itemKey] || 0) + 1;
    const newGravyDipOptions = {
      ...gravyDipOptions,
      [itemKey]: newCount,
    };
    setGravyDipOptions(newGravyDipOptions);
    updateTotal(newGravyDipOptions); // Update total amount
  };

  const handleRemoveGravyDip = () => {
    if (gravyDipOptions[itemKey] > 0) {
      const newCount = gravyDipOptions[itemKey] - 1;
      const newGravyDipOptions = {
        ...gravyDipOptions,
        [itemKey]: newCount,
      };
      setGravyDipOptions(newGravyDipOptions);
      updateTotal(newGravyDipOptions); // Update total amount
    }
  };

  return (
    <div className="flex items-center mt-4">
      <button
        onClick={handleAddGravyDip}
        className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600 transition"
      >
        Add Gravy/Dip
      </button>
      <button
        onClick={handleRemoveGravyDip}
        className="ml-2 bg-gray-500 text-white px-2 py-1 rounded-md hover:bg-gray-600 transition"
      >
        Remove Gravy/Dip
      </button>
      <span className="ml-4 text-gray-900">
        {gravyDipOptions[itemKey] || 0} Gravy/Dip
      </span>
    </div>
  );
};

GravyDip.propTypes = {
  itemKey: PropTypes.string.isRequired,
  gravyDipOptions: PropTypes.object.isRequired,
  setGravyDipOptions: PropTypes.func.isRequired,
  updateTotal: PropTypes.func.isRequired,
};

export default GravyDip;
