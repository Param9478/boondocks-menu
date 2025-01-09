import { useState } from 'react';
import menuData from '../menu.json';
import MenuItem from './components/MenuItem';
import SelectedItems from './components/SelectedItems';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [gravyDipOptions, setGravyDipOptions] = useState({});
  const [openCategory, setOpenCategory] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  const filteredMenu = menuData.menu.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  const addItemToBill = (item, option) => {
    // Check if the item requires an option but none is selected
    if (item.options && item.options.length > 0 && !option) {
      toast.error('Please select an option before adding to cart.');
      return;
    }

    const key = option ? `${item.name}-${option.name}` : item.name;
    const existingItemIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.key === key
    );

    if (existingItemIndex !== -1) {
      setSelectedItems(
        selectedItems.map((selectedItem, index) =>
          index === existingItemIndex
            ? { ...selectedItem, quantity: selectedItem.quantity + 1 }
            : selectedItem
        )
      );
      toast.success(`${item.name} quantity increased!`);
    } else {
      setSelectedItems([
        ...selectedItems,
        {
          ...item,
          price: option ? option.price : item.price,
          quantity: 1,
          key,
          option: option ? option.name : null,
          protein: option?.protein || null,
        },
      ]);
      toast.success(`${item.name} added to cart!`);
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
      toast.success(`${item.name} quantity decreased!`);
    } else {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.key !== key)
      );
      toast.success(`${item.name} removed from cart!`);
    }
  };

  const deleteItemFromBill = (item) => {
    setSelectedItems(
      selectedItems.filter((selectedItem) => selectedItem.key !== item.key)
    );
    toast.success(`${item.name} completely removed from cart!`);
  };

  const getItemQuantity = (key) => {
    const item = selectedItems.find((selectedItem) => selectedItem.key === key);
    return item ? item.quantity : 0;
  };

  const calculateTotal = () => {
    let total = 0;
    let savings = 0;

    selectedItems.forEach((item) => {
      if (item.name === 'Wings' && item.option === '10 Wings') {
        const setsOfTwenty = Math.floor(item.quantity / 2);
        const remainingTens = item.quantity % 2;
        total += setsOfTwenty * 28 + remainingTens * 15;
        savings += setsOfTwenty * 2;
      } else {
        total += item.price * item.quantity;
      }

      // Add the cost of gravy/dip
      if (gravyDipOptions[item.key]) {
        total += 2 * gravyDipOptions[item.key];
      }
    });

    return { total: total.toFixed(2), savings };
  };

  const toggleCategory = (categoryIndex) => {
    setOpenCategory(openCategory === categoryIndex ? null : categoryIndex);
  };

  return (
    <div className="bg-gray-200 min-h-screen py-10 px-4 flex flex-col lg:flex-row">
      <div className="w-full lg:w-3/4 lg:pr-4">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 overflow-auto">
          <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-8">
            The Boondocks Grill Menu
          </h1>

          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-pink-300 transition duration-200 ease-in-out transform hover:scale-105"
          />

          {filteredMenu.map((category, index) => (
            <div key={index} className="mb-8">
              <h2
                onClick={() => toggleCategory(index)}
                className="text-2xl font-bold text-gray-800 border-b-4 border-pink-500 pb-2 mb-4 cursor-pointer flex items-center justify-between transition duration-200 ease-in-out transform hover:scale-105"
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
        gravyDipOptions={gravyDipOptions}
        setGravyDipOptions={setGravyDipOptions}
        addItemToBill={addItemToBill}
        removeItemFromBill={removeItemFromBill}
        deleteItemFromBill={deleteItemFromBill}
        calculateTotal={calculateTotal}
      />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
