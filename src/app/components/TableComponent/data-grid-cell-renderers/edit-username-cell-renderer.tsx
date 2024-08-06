import { FC, useState } from "react";
import { Button, Modal, Input } from "antd";
import { EditFilled } from "@ant-design/icons";

interface EditUsernameProps {
  initialValue: string;
  onCancel: () => void;
  onUpdate: (newValue: string) => void;
}

const EditUsernameModal: FC<EditUsernameProps> = ({
  initialValue,
  onCancel,
  onUpdate,
}) => {
  const [username, setUsername] = useState(initialValue);

  const handleUpdate = () => {
    onUpdate(username);
    onCancel();
  };

  return (
    <Modal
      title={
        <div>
        <span className="font-semibold  text-xl">Edit Username</span>
        <hr className="border-gray-300 mt-2 mb-8" />
      </div>
      }
      centered
      open={true}
      onCancel={onCancel}
      footer={[
        // <hr className="border-gray-300 mb-4 mt-8" />,
        <div className="flex justify-center space-x-2 mt-10" key="buttons">
          <Button key="cancel" onClick={onCancel} className="cancel-btn h-[30px] font-semibold  text-base">
            Cancel
          </Button>
          <Button key="update" onClick={handleUpdate} className="save-btn font-semibold  text-base">
            Update
          </Button>
        </div>,
      ]}
      style={{ height: '500px' }}
    >
      <div className="flex justify-center items-center">
        <span className="mr-4 font-medium  text-lg">UserName:</span>
        <Input
          className=" text-base h-10"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter new username"
        />
      </div>
    </Modal>
  );
};

const EditUsernameCellRenderer: FC<{ value: string }> = ({ value }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleUpdateUsername = (newUsername: string) => {
    // Logic to update username (e.g., API call)
    handleCloseModal(); // Close modal after update
  };

  return (
    <>
      <Button
        type="link"
        icon={<EditFilled />}
        onClick={handleOpenModal}
        className="mr-1"
      />
      <a onClick={handleOpenModal} className="text-blue-500 cursor-pointer">
        {value}
      </a>
      {modalOpen && (
        <EditUsernameModal
          initialValue={value}
          onCancel={handleCloseModal}
          onUpdate={handleUpdateUsername}
        />
      )}
    </>
  );
};

export function renderEditUsernameCell(value: string) {
  return <EditUsernameCellRenderer value={value} />;
}

export default EditUsernameCellRenderer