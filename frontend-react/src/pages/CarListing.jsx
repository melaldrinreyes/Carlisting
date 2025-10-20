import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import CarCard from '../components/CarCard';
import Pagination from '../components/Pagination';
import { carsData } from '../data/carsData';
import './CarListing.css';

const CarListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 6;

  // Filter cars based on search term
  const filteredCars = useMemo(() => {
    return carsData.filter((car) =>
      car.model.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to page 1 when search changes
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  return (
    <div className="car-listing-page">
      <Navbar />
      
      <div className="car-listing-container">
        <h1 className="listing-title">Browse Our Car Collection</h1>
        <p className="listing-subtitle">
          Find your perfect vehicle from our extensive inventory
        </p>

        <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

        {filteredCars.length === 0 ? (
          <div className="no-results">
            <p>No cars found matching "{searchTerm}"</p>
          </div>
        ) : (
          <>
            <div className="cars-grid">
              {/* Use Map Function to iterate through cars */}
              {currentCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CarListing;
