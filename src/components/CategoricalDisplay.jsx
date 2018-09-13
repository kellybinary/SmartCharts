import React, { Fragment } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
    CategoryIconMap, ItemIconMap, SearchIcon, ActiveOptionsIconMap, CloseIcon,
} from './Icons.jsx';
import Favorite from './Favorite.jsx';
import '../../sass/components/_categorical-display.scss';

const Icon = ({ id }) => {
    if (!id || !ItemIconMap[id]) { return ''; }
    const ItemIcon = ItemIconMap[id];
    return <ItemIcon className={`ic-${id}`} />;
};


const CategoricalDisplay = ({
    isMobile,
    placeholderText,
    setSearchInput,
    filterText,
    setFilterText,
    clearFilterText,
    handleFilterClick,
    hasActiveItems,
    filteredItems,
    getItemCount,
    onSelectItem,
    activeOptions,
    setScrollPanel,
    setCategoryElement,
    activeCategoryKey,
    favoritesId,
    isScrollingDown,
    updateScrollSpy,
    scrollUp,
    scrollDown,
}) => {
    /**
     * On mobile mode, this part appear on the top of dialog
     * @return HTML
     */
    const renderText = item => <span className="ciq-item-display">{item.display}</span>;

    const renderLeft = item => (
        <div className="left">
            <Icon id={item.itemId} />
            {renderText(item)}
        </div>);

    const renderItem = (item, k) => (
        <div
            className={`cq-item ${item.selected ? 'selected ' : ''}`}
            onClick={e => item.enabled && onSelectItem(item.dataObject, e)}
            disabled={!item.enabled}
            key={k}
        >
            {renderLeft(item)}

            <div className="right">
                {(item.dataObject && (item.dataObject.exchange_is_open === undefined || item.dataObject.exchange_is_open)) ? '' : <span className="closed-market">{t.translate('CLOSED')}</span>}
                <Favorite
                    category={favoritesId}
                    id={item.itemId}
                />
            </div>
        </div>);

    const renderActiveItem = (item, k) => (
        <div
            className="cq-active-item"
            key={k}
        >
            {renderLeft(item)}
            <div className="right">
                {activeOptions && (
                    <span className="cq-active-options">
                        {activeOptions.map((opt) => {
                            const ActiveOptionIcon = ActiveOptionsIconMap[opt.id];
                            return (
                                <span
                                    key={opt.id}
                                    className={`ic-${opt.id}`}
                                    onClick={e => opt.onClick && opt.onClick(item.dataObject, e)}
                                >
                                    {ActiveOptionIcon && <ActiveOptionIcon />}
                                    {opt.renderChild && opt.renderChild(item)}
                                </span>
                            );
                        })}
                    </span>
                )}
                <Favorite
                    category={favoritesId}
                    id={item.itemId}
                />
            </div>
        </div>);

    return (
        <div className="cq-categorical-display">
            <div className={`cq-lookup-filters ${isScrollingDown ? 'scroll-down' : ''}`}>
                <div className={`cq-lookup-input ${filterText.trim() !== '' ? 'active' : ''}`}>
                    <input
                        ref={el =>  setSearchInput(el)}
                        onChange={e => setFilterText(e.target.value)}
                        type="text"
                        spellCheck="off"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        placeholder={placeholderText}
                    />
                    <SearchIcon />
                    <CloseIcon className="icon-reset" onClick={() => clearFilterText()} />
                </div>
                <div className="cq-filter-panel">
                    { filteredItems.map((category) => {
                        const CategoryIcon = CategoryIconMap[category.categoryId];
                        const isActive = activeCategoryKey === category.categoryId;
                        return (
                            <div
                                key={category.categoryId}
                                className={`cq-filter ${isActive ? 'cq-active-filter' : ''} ${!isMobile ? 'cq-hover-style' : ''}`}
                                onClick={e => handleFilterClick(category, e)}
                            >
                                {CategoryIcon && <CategoryIcon className={`ic-${category.categoryId}`} />}
                                <span className="cq-filter-text">{t.translate(category.categoryName)}</span>
                            </div>);
                    })}
                </div>
            </div>
            <PerfectScrollbar
                className="cq-scroll-panel"
                ref={setScrollPanel}
                onScrollY={e => updateScrollSpy(e)}
                onScrollUp={scrollUp}
                onScrollDown={scrollDown}
            >
                <div className="results-panel">
                    { filteredItems.map(category => (getItemCount(category) > 0 || category.emptyDescription) && (
                        <div
                            key={category.categoryId}
                            className={`category category-${category.categoryId}`}
                            ref={el => setCategoryElement(el, category.categoryId)}
                        >
                            <div className="category-title">{t.translate(category.categoryName)}</div>
                            { category.hasSubcategory
                                ? category.data.map(subcategory => getItemCount(subcategory) > 0 && (
                                    <Fragment key={subcategory.subcategoryName}>
                                        <div className="category-content">
                                            <div className="subcategory">{t.translate(subcategory.subcategoryName)}</div>
                                            { subcategory.data.map(renderItem)}
                                        </div>
                                    </Fragment>
                                ))
                                : category.data.length > 0 && (
                                    <div className="category-content">
                                        {category.data.map((category.categoryId === 'active' && hasActiveItems) ? renderActiveItem : renderItem)}
                                    </div>
                                )}
                            { getItemCount(category) === 0 && category.emptyDescription && (
                                <div className="category-content">
                                    <div className="empty-category">{t.translate(category.emptyDescription)}</div>
                                </div>
                            )}
                        </div>
                    )) }
                </div>
            </PerfectScrollbar>
        </div>
    );
};

export default CategoricalDisplay;
