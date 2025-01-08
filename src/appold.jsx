import { useState } from 'react';
import menuData from '../menu.json';

const StylishMenu = () => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  const filteredMenu = menuData.menu.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  const addItemToBill = (item, option) => {
    const key = option ? `${item.name}-${option.name}` : item.name;
    const existingItem = selectedItems.find(
      (selectedItem) => selectedItem.key === key
    );
    if (existingItem) {
      setSelectedItems(
        selectedItems.map((selectedItem) =>
          selectedItem.key === key
            ? { ...selectedItem, quantity: selectedItem.quantity + 1 }
            : selectedItem
        )
      );
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          ...item,
          price: option ? option.price : item.price,
          quantity: 1,
          key,
          option: option ? option.name : null,
        },
      ]);
    }
  };

  const removeItemFromBill = (item) => {
    const key = item.key;
    const existingItem = selectedItems.find(
      (selectedItem) => selectedItem.key === key
    );
    if (existingItem.quantity > 1) {
      setSelectedItems(
        selectedItems.map((selectedItem) =>
          selectedItem.key === key
            ? { ...selectedItem, quantity: selectedItem.quantity - 1 }
            : selectedItem
        )
      );
    } else {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.key !== key)
      );
    }
  };

  const deleteItemFromBill = (item) => {
    setSelectedItems(
      selectedItems.filter((selectedItem) => selectedItem.key !== item.key)
    );
  };

  const getItemQuantity = (key) => {
    const item = selectedItems.find((selectedItem) => selectedItem.key === key);
    return item ? item.quantity : 0;
  };

  const calculateTotal = () => {
    return selectedItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const toggleCategory = (categoryIndex) => {
    setOpenCategory(openCategory === categoryIndex ? null : categoryIndex);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 flex">
      <div className="w-3/4 pr-4">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 overflow-auto">
          <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-8">
            The Boondocks Grill Menu
          </h1>

          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
          />

          {filteredMenu.map((category, index) => (
            <div key={index} className="mb-8">
              <h2
                onClick={() => toggleCategory(index)}
                className="text-2xl font-bold text-gray-800 border-b-4 border-pink-500 pb-2 mb-4 cursor-pointer flex items-center justify-between"
              >
                {category.category}
                <span
                  className={`transform transition-transform duration-300 ${
                    openCategory === index ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  ▼
                </span>
              </h2>
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openCategory === index
                    ? 'max-h-screen opacity-100'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.length > 0 ? (
                    category.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-6 border border-gray-300 rounded-lg hover:shadow-2xl transition-shadow bg-white"
                      >
                        <h3 className="text-xl font-semibold text-gray-900">
                          {item.name}
                        </h3>
                        <p className="text-gray-700 mt-2">
                          {item.description || 'No description available.'}
                        </p>
                        {item.options ? (
                          <select
                            onChange={(e) =>
                              setSelectedOptions({
                                ...selectedOptions,
                                [item.name]: JSON.parse(e.target.value),
                              })
                            }
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
                          <p className="text-gray-900 font-bold mt-4">
                            ${item.price.toFixed(2)}
                          </p>
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
                              {getItemQuantity(
                                `${item.name}-${selectedOptions[item.name].name}`
                              )}
                            </span>
                            <button
                              onClick={() =>
                                addItemToBill(item, selectedOptions[item.name])
                              }
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
                                removeItemFromBill({
                                  name: item.name,
                                  key: item.name,
                                })
                              }
                              className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600 transition"
                            >
                              -
                            </button>
                            <span className="mx-2">
                              {getItemQuantity(item.name)}
                            </span>
                            <button
                              onClick={() => addItemToBill(item)}
                              className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600 transition"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No items found for this category.
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-1/4 pl-4 bg-gray-50 p-6 rounded-lg shadow-inner">
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
          Selected Items
        </h2>
        {selectedItems.length > 0 ? (
          <ul>
            {selectedItems.map((item, index) => (
              <li
                key={index}
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
        <div className="mt-6 text-2xl font-bold text-gray-900">
          Total: ${calculateTotal()}
        </div>
      </div>
    </div>
  );
};

export default StylishMenu;
