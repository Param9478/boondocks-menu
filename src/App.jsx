import { useState } from 'react';
import menuData from '../menu.json';
import MenuItem from './components/MenuItem';
import SelectedItems from './components/SelectedItems';

const App = () => {
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
    <div className="bg-gray-100 min-h-screen py-10 px-4 flex flex-col lg:flex-row">
      <div className="w-full lg:w-3/4 lg:pr-4">
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
                className={`overflow-auto transition-all duration-500 ${
                  openCategory === index
                    ? 'h-auto opacity-100'
                    : 'h-0 opacity-0'
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {category.items.length > 0 ? (
                    category.items.map((item, idx) => (
                      <MenuItem
                        key={idx}
                        item={item}
                        addItemToBill={addItemToBill}
                        removeItemFromBill={removeItemFromBill}
                        getItemQuantity={getItemQuantity}
                        selectedOptions={selectedOptions}
                        setSelectedOptions={setSelectedOptions}
                      />
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
      <SelectedItems
        selectedItems={selectedItems}
        addItemToBill={addItemToBill}
        removeItemFromBill={removeItemFromBill}
        deleteItemFromBill={deleteItemFromBill}
        calculateTotal={calculateTotal}
      />
    </div>
  );
};

export default App;
