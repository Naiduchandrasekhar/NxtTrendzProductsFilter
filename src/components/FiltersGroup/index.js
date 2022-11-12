import {BsSearch} from 'react-icons/bs'
import './index.css'

const FiltersGroup = props => {
  const {searchValue} = props
  const renderProductCategory = () => {
    const {categoryOptions, onCategoryTabClick, activeCategoryId} = props

    return categoryOptions.map(eachCategory => {
      const isCategoryActive = eachCategory.categoryId === activeCategoryId

      const classCategory = isCategoryActive ? 'active' : ''

      const onClickCategory = () => {
        onCategoryTabClick(eachCategory.categoryId)
      }

      return (
        <li
          key={eachCategory.categoryId}
          className={`categoryList ${classCategory}`}
          onClick={onClickCategory}
        >
          <p>{eachCategory.name}</p>
        </li>
      )
    })
  }

  const renderRatingsFilter = () => {
    const {ratingsList, onRatingTabClick, activeRatingId} = props
    return ratingsList.map(eachRating => {
      const isRatingActive = eachRating.ratingId === activeRatingId

      const classRating = isRatingActive ? 'activeRating' : ''

      const onClickRating = () => {
        onRatingTabClick(eachRating.ratingId)
      }

      return (
        <li
          key={eachRating.ratingId}
          className="ratingList"
          onClick={onClickRating}
        >
          <div className={`starContainer ${classRating}`}>
            <img
              src={eachRating.imageUrl}
              alt={`rating ${eachRating.ratingId}`}
              className="starImage"
            />
            <p>&up </p>
          </div>
        </li>
      )
    })
  }

  const onSearchInput = event => {
    const {onSearchChange} = props
    onSearchChange(event.target.value)
  }

  const onEnterSearchInput = event => {
    const {enterSearchInput} = props
    if (event.key === 'Enter') {
      enterSearchInput()
    }
  }

  const clearFilter = () => {
    const {clearAll} = props
    clearAll()
  }

  return (
    <>
      <div className="searchBar">
        <input
          className="inputText"
          type="search"
          value={searchValue}
          placeholder="Search"
          onChange={onSearchInput}
          onKeyDown={onEnterSearchInput}
        />
        <BsSearch />
      </div>
      <div className="filters-group-container">
        <h1 className="headerName">Category</h1>
        <ul className="unorderCategoryList">{renderProductCategory()}</ul>
        <h1 className="headerName">Rating</h1>
        <ul className="unorderRatingList">{renderRatingsFilter()}</ul>
        <button type="button" onClick={clearFilter} className="button">
          Clear Filters
        </button>
      </div>
    </>
  )
}
export default FiltersGroup
