import Card from '../../components/Card';

import PasswordForm from './PasswordForm';
import ProfileForm from './ProfileForm';

const Account = () => {
  return (
    <Card title="Mi Cuenta">
      <ProfileForm />
      <hr />
      <PasswordForm />
    </Card>
  );
};

export default Account;
