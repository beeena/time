import React, { useEffect, useState, useRef } from 'react';
import classnames from 'classnames';

import './style.scss';

import { searchTechnologies, addTechnology } from '../../configAPI';
import { useDebounce, useOutsideClick } from '../../services/hookHelpers';

const RemoveSvg = ({ ligthMode }) => (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.41016 0.0600899C8.33004 -0.02003 8.1989 -0.02003 8.11878 0.0600899L5.14572 3.03313C5.0656 3.11325 4.93446 3.11325 4.85434 3.03313L1.88133 0.0600899C1.80121 -0.02003 1.67007 -0.02003 1.58995 0.0600899L0.0600902 1.58989C-0.0200301 1.67 -0.0200301 1.80115 0.0600902 1.88127L3.03315 4.85431C3.11327 4.93443 3.11327 5.06557 3.03315 5.14569L0.0600902 8.11873C-0.0200301 8.19885 -0.0200301 8.33 0.0600902 8.41012L1.58989 9.93991C1.67001 10.02 1.80116 10.02 1.88128 9.93991L4.85434 6.96687C4.93446 6.88675 5.0656 6.88675 5.14572 6.96687L8.11872 9.93985C8.19884 10.02 8.32999 10.02 8.41011 9.93985L9.93991 8.41006C10.02 8.32994 10.02 8.1988 9.93991 8.11868L6.96691 5.14569C6.88679 5.06557 6.88679 4.93443 6.96691 4.85431L9.93991 1.88132C10.02 1.8012 10.02 1.67006 9.93991 1.58994L8.41016 0.0600899Z"
            fill={ligthMode ? '#FFFFFF' : '#181818'}
        />
    </svg>
);

const TechnologyComponent = ({ userTechnologies, setUserTechnologies, themeLight, vocabulary }) => {
    const [searchInput, setSearchInput] = useState('');
    const [techList, setTechList] = useState([]);
    const [searchItems, setSearchItems] = useState([]);
    const [isFetching, setIsFetching] = useState(false);

    const debouncedSearchValue = useDebounce(searchInput, 1000);

    const wrapperRef = useRef(null);
    useOutsideClick(wrapperRef, () => setSearchItems([]));

    useEffect(
        () => {
            setTechList(userTechnologies);
        },
        [userTechnologies]
    );

    useEffect(
        () => {
            if (debouncedSearchValue) {
                getTechnologiesList(debouncedSearchValue);
            } else {
                setSearchItems([]);
            }
        },
        [debouncedSearchValue]
    );

    const removeTechnologyFromList = id => {
        setUserTechnologies(techList.filter(item => item.id !== id));
    };

    const getTechnologiesList = async title => {
        const res = await searchTechnologies(title);
        setSearchItems(removeUsedTechFromResult(res.data.data.technology));
    };

    const addTechnologyToList = item => {
        techList.push(item);
        setUserTechnologies(techList);
        setSearchItems([]);
        setSearchInput('');
    };

    const removeUsedTechFromResult = resArr => {
        return resArr.filter(item => !techList.some(tech => tech.id === item.id));
    };

    const createTechnology = async () => {
        setIsFetching(true);
        const res = await addTechnology(searchInput);
        techList.push({ title: searchInput, id: res.data.data.insert_technology.returning[0].id });
        setUserTechnologies(techList);
        setSearchItems([]);
        setSearchInput('');
        setIsFetching(false);
    };

    const { v_enter_text, v_add_technology } = vocabulary;
    return (
        <div className={classnames('technology-wrapper')}>
            <div
                className={classnames('technology', {
                    'technology--light': themeLight,
                })}
            >
                {!!techList.length && (
                    <div className={classnames('technology__list')}>
                        {techList.map((technology, index) => (
                            <div
                                className={classnames('technology__list-tag', {
                                    'technology__list-tag--light': themeLight,
                                })}
                                key={index}
                            >
                                <span className={classnames('technology__list-tag-title')}>{technology.title}</span>
                                <span
                                    className={classnames('technology__list-tag-remove-icon')}
                                    onClick={e => removeTechnologyFromList(technology.id)}
                                >
                                    <RemoveSvg ligthMode={themeLight} />
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                <div className={classnames('technology__search')}>
                    <input
                        type="text"
                        className={classnames('technology__search-input', {
                            'technology__search-input--light': themeLight,
                        })}
                        value={searchInput}
                        onChange={e => setSearchInput(e.target.value)}
                        placeholder={v_enter_text}
                    />
                    {!!searchInput.length && (
                        <button
                            className={classnames('technology__search-add')}
                            disabled={isFetching}
                            onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                createTechnology();
                            }}
                        >
                            {v_add_technology}
                        </button>
                    )}
                </div>
            </div>
            {!!searchItems.length && (
                <div
                    className={classnames('technology__suggestions', {
                        'technology__suggestions--light': themeLight,
                    })}
                    ref={wrapperRef}
                >
                    {searchItems.map((item, index) => (
                        <div
                            key={index}
                            className={classnames('technology__suggestions-item', {
                                'technology__suggestions-item--light': themeLight,
                            })}
                            onClick={e => addTechnologyToList(item)}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TechnologyComponent;
