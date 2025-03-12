import { useState, useEffect } from 'react';
import menuData from '../menu.json';
import MenuItem from './components/MenuItem';
import SelectedItems from './components/SelectedItems';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSearch, FaTimes } from 'react-icons/fa';

const App = () => {
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [openCategories, setOpenCategories] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [showReceipt, setShowReceipt] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    if (search) {
      const matchedCategories = menuData.menu
        .map((category, index) => {
          const items = category.items.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
          );
          return items.length > 0 ? { ...category, items, index } : null;
        })
        .filter((category) => category !== null);

      setFilteredCategories(matchedCategories);

      // Open all matched categories
      const matchedIndices = matchedCategories.map(
        (category) => category.index
      );
      setOpenCategories(matchedIndices);

      // Smoothly scroll to the first matched category
      // if (matchedCategories.length > 0) {
      //   const firstMatchedCategory = document.getElementById(
      //     `category-${matchedCategories[0].index}`
      //   );
      //   if (firstMatchedCategory) {
      //     firstMatchedCategory.scrollIntoView({
      //       behavior: 'smooth',
      //       block: 'start',
      //     });
      //   }
      // }
    } else {
      setFilteredCategories(menuData.menu); // Reset to original categories if search is empty
      setOpenCategories([]); // Close all categories when there's no search query
    }
  }, [search]);

  const handleCheckout = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success('Your order has been placed successfully!');
    setTimeout(() => {
      updateSelectedItems([]);
      setShowReceipt(false);
      setSearch('');
      setOpenCategories([]); // Close all toggles
    }, 2000); // Wait for 2 seconds before clearing the cart and closing toggles
  };

  const addItemToBill = (item, option) => {
    // For items with sides, always add as a new entry with a unique identifier
    if (option && option.name === 'With Side') {
      // Create a unique key with timestamp to ensure uniqueness
      const uniqueKey = `${item.name}-${option.name}-${Date.now()}`;

      const newItem = {
        ...item,
        price: option.price,
        quantity: 1,
        key: uniqueKey,
        option: option.name,
      };

      setSelectedItems([...selectedItems, newItem]);
      toast.success(`${item.name} added to cart!`);
    } else {
      // For non-side items, keep the existing logic of incrementing quantity
      const key = option ? `${item.name}-${option.name}` : item.name;
      const existingItemIndex = selectedItems.findIndex(
        (selectedItem) => selectedItem.key === key
      );

      if (existingItemIndex !== -1) {
        const updatedItems = selectedItems.map((selectedItem, index) => {
          if (index === existingItemIndex) {
            return { ...selectedItem, quantity: selectedItem.quantity + 1 };
          }
          return selectedItem;
        });
        setSelectedItems(updatedItems);
        toast.success(`${item.name} quantity increased!`);
      } else {
        const newItem = {
          ...item,
          price: option ? option.price : item.price,
          quantity: 1,
          key,
          option: option ? option.name : null,
        };
        setSelectedItems([...selectedItems, newItem]);
        toast.success(`${item.name} added to cart!`);
      }
    }
    // In addItemToBill function, add basePrice to items with sides
    if (option && option.name === 'With Side') {
      const uniqueKey = `${item.name}-${option.name}-${Date.now()}`;

      const newItem = {
        ...item,
        basePrice: option.price, // Store the base price for later calculations
        price: option.price,
        quantity: 1,
        key: uniqueKey,
        option: option.name,
      };

      setSelectedItems([...selectedItems, newItem]);
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

  const toggleCategory = (index) => {
    setOpenCategories((prevOpenCategories) => {
      if (prevOpenCategories.includes(index)) {
        return prevOpenCategories.filter(
          (categoryIndex) => categoryIndex !== index
        );
      } else {
        return [...prevOpenCategories, index];
      }
    });
  };

  const handleSearchClick = () => {
    const matchedCategories = menuData.menu
      .map((category, index) => {
        const items = category.items.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
        return items.length > 0 ? { ...category, items, index } : null;
      })
      .filter((category) => category !== null);

    setFilteredCategories(matchedCategories);

    // Open all matched categories
    const matchedIndices = matchedCategories.map((category) => category.index);
    setOpenCategories(matchedIndices);

    // Smoothly scroll to the first matched category
    if (matchedCategories.length > 0) {
      const firstMatchedCategory = document.getElementById(
        `category-${matchedCategories[0].index}`
      );
      if (firstMatchedCategory) {
        firstMatchedCategory.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen  px-4 flex flex-col lg:flex-row justify-center align-middle">
      <div className="max-w-6xl w-full lg:w-3/4 lg:pr-4">
        <div className="mx-auto bg-white shadow-2xl rounded-xl p-8 overflow-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-400 to-blue-600 text-white py-4 rounded-lg shadow-md">
            The Boondocks Grill Menu
          </h1>
          <div className="relative w-full top-0 z-50 bg-white shadow-md">
            <input
              type="text"
              placeholder="Search menu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearchClick();
                  e.target.blur(); // Trigger the search action on Enter key press
                }
              }}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 
    placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 
    focus:border-blue-500 transition duration-200 ease-in-out shadow-md"
            />
            <button
              onClick={handleSearchClick}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              <FaSearch className="h-5 w-5" />
            </button>
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                style={{
                  width: '5rem',
                  height: '1.5rem',
                  display: 'flex',
                  justifyContent: 'right',
                  alignItems: 'right',
                }} // Increase size for better tap target
              >
                <FaTimes className="h-6 w-6" />
              </button>
            )}
          </div>

          {filteredCategories.map((category, index) => (
            <div key={index} id={`category-${category.index}`} className="mt-8">
              <h2
                onClick={() => toggleCategory(category.index)}
                className="text-2xl font-bold text-blue-900 border-b-4 border-blue-500 pb-2 mb-4 cursor-pointer flex items-center justify-between transition duration-200 ease-in-out transform hover:scale-105"
              >
                {category.category}
                <span
                  className={`transform transition-transform duration-300 ${
                    openCategories.includes(category.index)
                      ? 'rotate-180'
                      : 'rotate-0'
                  }`}
                >
                  ▼
                </span>
              </h2>
              <div
                className={`overflow-auto transition-all duration-500 ${
                  openCategories.includes(category.index)
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
                        deleteItemFromBill={deleteItemFromBill}
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
        handleCheckout={handleCheckout}
        showReceipt={showReceipt}
        setShowReceipt={setShowReceipt}
        deleteItemFromBill={deleteItemFromBill}
        calculateTotal={calculateTotal}
        updateSelectedItems={updateSelectedItems}
      />

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
