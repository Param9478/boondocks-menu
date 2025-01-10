import { useState, useEffect } from 'react';
import menuData from '../menu.json';
import MenuItem from './components/MenuItem';
import SelectedItems from './components/SelectedItems';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [openCategories, setOpenCategories] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  const filteredMenu = menuData.menu.map((category) => ({
    ...category,
    items: category.items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  useEffect(() => {
    if (search) {
      const categoriesToOpen = menuData.menu
        .map((category, index) => {
          const items = category.items.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          );
          return items.length > 0 ? index : null;
        })
        .filter((index) => index !== null);
      setOpenCategories(categoriesToOpen);
    } else {
      setOpenCategories([]); // Close all categories when there's no search query
    }
  }, [search]);

  const addItemToBill = (item, option) => {
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
      toast.error(`${item.name} quantity decreased!`);
    } else {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.key !== key)
      );
      toast.error(`${item.name} removed from cart!`);
    }
  };

  const deleteItemFromBill = (item) => {
    setSelectedItems(
      selectedItems.filter((selectedItem) => selectedItem.key !== item.key)
    );
    toast.error(`${item.name} completely removed from cart!`);
  };

  const getItemQuantity = (key) => {
    const item = selectedItems.find((selectedItem) => selectedItem.key === key);
    return item ? item.quantity : 0;
  };

  const updateSelectedItems = (updatedItems) => {
    setSelectedItems(updatedItems);
  };

  const calculateTotal = (selectedItems) => {
    let total = 0;
    let savings = 0;

    selectedItems.forEach((item) => {
      if (item.name === 'Wings') {
        const setsOfTwo = Math.floor(item.quantity / 2);
        const remainingWings = item.quantity % 2;
        total += setsOfTwo * 28 + remainingWings * 15;
        savings += setsOfTwo * 2; // Calculate savings
      } else {
        total += item.price * item.quantity;
      }
    });

    return { total: total.toFixed(2), savings };
  };

  const toggleCategory = (categoryIndex) => {
    setOpenCategories((prevOpenCategories) =>
      prevOpenCategories.includes(categoryIndex)
        ? prevOpenCategories.filter((index) => index !== categoryIndex)
        : [...prevOpenCategories, categoryIndex]
    );
  };

  return (
    <div className="bg-gray-200 min-h-screen py-10 px-4 flex flex-col lg:flex-row">
      <div className="w-full lg:w-3/4 lg:pr-4">
        <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-xl p-8 overflow-auto">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-8">
            The Boondocks Grill Menu
          </h1>

          <input
            type="text"
            placeholder="Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onBlur={() => document.activeElement.blur()}
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
                    openCategories.includes(index) ? 'rotate-180' : 'rotate-0'
                  }`}
                >
                  ▼
                </span>
              </h2>
              <div
                className={`overflow-auto transition-all duration-500 ${
                  openCategories.includes(index)
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
        updateSelectedItems={updateSelectedItems}
      />

      <ToastContainer
        position="top-center"
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
