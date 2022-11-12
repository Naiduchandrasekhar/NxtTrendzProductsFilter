import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import FiltersGroup from '../FiltersGroup'
import ProductCard from '../ProductCard'
import ProductsHeader from '../ProductsHeader'

import './index.css'

const categoryOptions = [
  {
    name: 'Clothing',
    categoryId: '1',
  },
  {
    name: 'Electronics',
    categoryId: '2',
  },
  {
    name: 'Appliances',
    categoryId: '3',
  },
  {
    name: 'Grocery',
    categoryId: '4',
  },
  {
    name: 'Toys',
    categoryId: '5',
  },
]

const sortbyOptions = [
  {
    optionId: 'PRICE_HIGH',
    displayText: 'Price (High-Low)',
  },
  {
    optionId: 'PRICE_LOW',
    displayText: 'Price (Low-High)',
  },
]

const ratingsList = [
  {
    ratingId: '4',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-four-stars-img.png',
  },
  {
    ratingId: '3',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-three-stars-img.png',
  },
  {
    ratingId: '2',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-two-stars-img.png',
  },
  {
    ratingId: '1',
    imageUrl:
      'https://assets.ccbp.in/frontend/react-js/rating-one-star-img.png',
  },
]

const apiConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class AllProductsSection extends Component {
  state = {
    productsList: [],
    apiType: apiConstants.initial,
    activeOptionId: sortbyOptions[0].optionId,
    activeCategoryId: '',
    activeRatingId: '',
    searchValue: '',
  }

  componentDidMount() {
    this.getProducts()
  }

  getProducts = async () => {
    this.setState({
      apiType: apiConstants.loading,
    })
    const jwtToken = Cookies.get('jwt_token')

    // TODO: Update the code to get products with filters applied

    const {
      activeOptionId,
      activeCategoryId,
      activeRatingId,
      searchValue,
    } = this.state

    const apiUrl = `https://apis.ccbp.in/products?sort_by=${activeOptionId}&category=${activeCategoryId}&title_search=${searchValue}&rating=${activeRatingId}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.products.map(product => ({
        title: product.title,
        brand: product.brand,
        price: product.price,
        id: product.id,
        imageUrl: product.image_url,
        rating: product.rating,
      }))
      this.setState({
        productsList: updatedData,
        apiType: apiConstants.success,
      })
    } else {
      this.setState({apiType: apiConstants.failure})
    }
  }

  changeSortby = activeOptionId => {
    this.setState({activeOptionId}, this.getProducts)
  }

  onCategoryTabClick = categoryId => {
    this.setState({activeCategoryId: categoryId}, this.getProducts)
  }

  onRatingTabClick = ratingId => {
    this.setState({activeRatingId: ratingId}, this.getProducts)
  }

  onSearchChange = value => {
    this.setState({searchValue: value})
  }

  enterSearchInput = () => {
    this.getProducts()
  }

  clearAll = () => {
    this.setState(
      {
        searchValue: '',
        activeRatingId: '',
        activeCategoryId: '',
        activeOptionId: sortbyOptions[0].optionId,
        productsList: [],
        apiType: apiConstants.initial,
      },
      this.getProducts,
    )
  }

  renderProductsList = () => {
    const {productsList, activeOptionId} = this.state

    console.log(productsList)

    // TODO: Add No Products View
    const showProducts = productsList.length === 0

    return showProducts ? (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-no-products-view.png"
          className="no-products-img"
          alt="no products"
        />
        <h1 className="no-products-heading">No Products Found</h1>
        <p className="no-products-description">
          We could not find any products. Try other filters.
        </p>
      </div>
    ) : (
      <div className="all-products-container">
        <ProductsHeader
          activeOptionId={activeOptionId}
          sortbyOptions={sortbyOptions}
          changeSortby={this.changeSortby}
        />

        <div className="filterContainer">
          <ul className="products-list">
            {productsList.map(product => (
              <ProductCard productData={product} key={product.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderLoader = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailure = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png "
        alt="products failure"
      />
    </div>
  )

  renderSwitchMethod = () => {
    const {apiType} = this.state

    switch (apiType) {
      case apiConstants.loading:
        return this.renderLoader()

      case apiConstants.success:
        return this.renderProductsList()

      case apiConstants.failure:
        return this.renderFailure()

      default:
        return null
    }
  }

  // TODO: Add failure view

  render() {
    const {activeCategoryId, activeRatingId, searchValue} = this.state
    return (
      <div className="all-products-section">
        <div className="filterGroup">
          <FiltersGroup
            categoryOptions={categoryOptions}
            ratingsList={ratingsList}
            onCategoryTabClick={this.onCategoryTabClick}
            activeCategoryId={activeCategoryId}
            onRatingTabClick={this.onRatingTabClick}
            activeRatingId={activeRatingId}
            onSearchChange={this.onSearchChange}
            enterSearchInput={this.enterSearchInput}
            searchValue={searchValue}
            clearAll={this.clearAll}
          />
        </div>
        {this.renderSwitchMethod()}
      </div>
    )
  }
}

export default AllProductsSection
