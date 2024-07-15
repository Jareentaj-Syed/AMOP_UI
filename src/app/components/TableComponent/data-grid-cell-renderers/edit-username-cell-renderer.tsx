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
      title="Edit Username"
      visible={true} // This should be controlled by a state in your actual implementation
      onOk={handleUpdate}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="update" type="primary" onClick={handleUpdate}>
          Update
        </Button>,
      ]}
    >
      <Input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter new username"
      />
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
    console.log("Updating username:", newUsername);
    handleCloseModal(); // Close modal after update
  };

  return (
    <>
      <Button
        type="link"
        icon={<EditFilled />}
        onClick={handleOpenModal}
        className="mr-2"
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