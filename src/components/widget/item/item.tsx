import { useLocalization } from '@hooks';
import { formatTime } from '@utils';
import { IconButton } from '@components/ui';
import { TNewsItem } from '@types';

type TItemProps = {
  item: TNewsItem;
  bookmarked: boolean;
  onAddBookmark: (item: TNewsItem) => void;
  onRemoveBookmark: (item: TNewsItem) => void;
};

function Item(props: TItemProps) {
  const { item, bookmarked, onAddBookmark, onRemoveBookmark } = props;
  const dic = useLocalization();

  const handleBookmarkClick = () => {
    bookmarked ? onRemoveBookmark(item) : onAddBookmark(item);
  };

  const handleShareClick = () => {
    navigator.share({ title: item.title, url: item.link });
  };

  const bookmarkIcon = bookmarked ? 'bookmark' : 'bookmark-empty';
  const bookmarkTitle = bookmarked ? dic.removeBookmark : dic.addBookmark;

  const isShareSupported = !!navigator.share;

  return (
    <li className="item">
      <span className="mr-2 color-secondary">{formatTime(item.created)}</span>
      <a
        href={item.link}
        target="_blank"
        rel="noreferrer"
        className="color-primary mr-2"
      >
        {item.title}
      </a>
      <div className="d-flex ml-auto flex-shrink-0 gap-1">
        <IconButton
          icon={bookmarkIcon}
          title={bookmarkTitle}
          onClick={handleBookmarkClick}
          size="small"
          className="btn"
        />
        {isShareSupported && (
          <IconButton
            icon="share"
            title={dic.share}
            onClick={handleShareClick}
            size="small"
            className="btn"
          />
        )}
      </div>
    </li>
  );
}

export default Item;
