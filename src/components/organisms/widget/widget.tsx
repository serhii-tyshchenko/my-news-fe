import { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'lodash';
import { useAppDispatch, useAppSelector, useLocalization } from 'common/hooks';

import { IconButton } from 'components/atoms';
import { Skeleton } from 'components/molecules';

import { TProvider, TNews, TNewsItem } from 'common/types';

import { selectBookmarksData } from 'store/selectors';
import { doAddBookmark, doRemoveBookmark } from 'store/actions';

import { fetchNews, formatTime } from './widget.utils';

import './widget.scss';

type TWidgetProps = {
  provider: TProvider;
};

const checkIfBookmarked = (bookmarks: Array<any>, item: TNewsItem) =>
  bookmarks.some((bookmark) => bookmark.link === item.link);

type TItemProps = {
  item: TNewsItem;
  isBookmarked: boolean;
  onAddBookmark: () => void;
  onRemoveBookmark: () => void;
};

function Item(props: TItemProps) {
  const {
    item: { title, link, created },
    isBookmarked,
    onAddBookmark,
    onRemoveBookmark,
  } = props;
  const dic = useLocalization();

  const handleClick = () => {
    if (isBookmarked) {
      onRemoveBookmark();
    } else {
      onAddBookmark();
    }
  };

  return (
    <li className="item">
      <span className="mr-2 color-secondary">{formatTime(created)}</span>
      <a
        href={link}
        target="_blank"
        rel="noreferrer"
        className="color-primary mr-2"
      >
        {title}
      </a>
      <IconButton
        icon={isBookmarked ? 'bookmark' : 'bookmark-empty'}
        title={isBookmarked ? dic.removeBookmark : dic.addBookmark}
        onClick={handleClick}
        size="small"
        className="ml-auto"
      />
    </li>
  );
}

function Widget({ provider }: TWidgetProps) {
  const [news, setNews] = useState([] as TNews);
  const [isLoading, setIsLoading] = useState(false);
  const dic = useLocalization();
  const dispatch = useAppDispatch();
  const bookmarks = useAppSelector(selectBookmarksData);

  const handleAddBookmark = (item: TNewsItem) => {
    dispatch(
      doAddBookmark({
        id: uuidv4(),
        title: item.title,
        link: item.link,
        created: item.created,
      })
    );
  };

  const handleRemoveBookmark = (item: TNewsItem) => {
    dispatch(doRemoveBookmark(item.link));
  };

  const handleRefresh = useCallback(() => {
    fetchNews(provider.id, setNews, setIsLoading);
  }, [provider.id]);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return (
    <li className="widget">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{provider.name}</h3>
        <IconButton
          icon="arrows-cw"
          title={dic.refresh}
          onClick={handleRefresh}
          className={isLoading ? 'animation-rotate' : ''}
        />
      </div>
      {isLoading && <Skeleton />}
      {isEmpty(news) && !isLoading && <div>{dic.noNews}</div>}
      {!isEmpty(news) && !isLoading && (
        <ul className="item-list">
          {news.map((item: TNewsItem) => (
            <Item
              key={item.link}
              item={item}
              isBookmarked={checkIfBookmarked(bookmarks, item)}
              onAddBookmark={() => handleAddBookmark(item)}
              onRemoveBookmark={() => handleRemoveBookmark(item)}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export default Widget;
