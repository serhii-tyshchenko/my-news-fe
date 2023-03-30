import { memo, useState } from 'react';

import { selectProvidersData, selectAddedProviders } from 'store/selectors';
import { useAppSelector } from 'common/hooks';

import { TProvider, TAddedProviders } from 'common/types';

import { Dialog } from 'components/molecules';

type TManageProvidersDialogProps = {
  onConfirm: (providers: TAddedProviders) => void;
  onClose: () => void;
};

function ManageProvidersDialog(props: TManageProvidersDialogProps) {
  const { onClose, onConfirm } = props;

  const availableProviders = useAppSelector(selectProvidersData);
  const addedProviders = useAppSelector(selectAddedProviders);

  const [selectedProviders, setSelectedProviders] = useState(addedProviders);

  const handleChange = (id: string) => {
    if (selectedProviders.includes(id)) {
      setSelectedProviders(
        selectedProviders.filter((item: string) => item !== id)
      );
    } else {
      setSelectedProviders([...selectedProviders, id]);
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedProviders);
    onClose();
  };

  return (
    <Dialog
      title="Manage Providers"
      onClose={onClose}
      onConfirm={handleConfirm}
    >
      <ul className="overflow-y-auto pr-2">
        {availableProviders.map((provider: TProvider) => (
          <li key={provider.id} className="mb-4">
            <div className="d-flex align-items-center">
              <img
                src={provider.logo}
                alt={provider.name}
                style={{ width: '16px' }}
                className="mr-2"
              />
              <a href={provider.homepage} target="_blank" rel="noreferrer">
                <h5>{provider.name}</h5>
              </a>
              <input
                type="checkbox"
                id={provider.id}
                checked={selectedProviders?.includes(provider.id)}
                onChange={() => handleChange(provider.id)}
                className="ml-auto"
              />
            </div>
            <p className="small">{provider.description}</p>
          </li>
        ))}
      </ul>
    </Dialog>
  );
}

export default memo(ManageProvidersDialog);