import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Camera, Trash2, Loader2, Eye, EyeOff, X } from 'lucide-react';
import { getCurrentUser, updateUserProfile, uploadProfileImage, changeUserPassword, deleteUserAccount, type User } from '../../data/firebaseData';

export default function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Pola hasła
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // State do pokazywania/ukrywania haseł
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);
  
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setNeighborhood(user.neighborhood || 'Śródmieście, Gdynia');
      setAvatarUrl(user.avatarUrl);
    }
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Proszę wybrać plik obrazu');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Zdjęcie nie może być większe niż 5MB');
      return;
    }
    
    setUploadingImage(true);
    try {
      const url = await uploadProfileImage(currentUser.id, file);
      setAvatarUrl(url);
      showMessage('success', 'Zdjęcie zostało przesłane');
    } catch (error) {
      console.error('Failed to upload image:', error);
      showMessage('error', 'Nie udało się przesłać zdjęcia');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      showMessage('error', 'Musisz być zalogowany');
      navigate('/auth');
      return;
    }

    if (!name.trim()) {
      showMessage('error', 'Imię i nazwisko jest wymagane');
      return;
    }

    setSaving(true);
    try {
      await updateUserProfile(currentUser.id, {
        name: name.trim(),
        bio: bio.trim() || '',
        neighborhood: neighborhood.trim(),
        avatarUrl: avatarUrl,
      });
      
      showMessage('success', 'Profil został zaktualizowany!');
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error) {
      console.error('Failed to update profile:', error);
      showMessage('error', 'Wystąpił błąd podczas zapisywania zmian');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!currentUser) return;
    
    if (!currentPassword.trim()) {
      showMessage('error', 'Proszę podać obecne hasło');
      return;
    }
    
    if (!newPassword.trim()) {
      showMessage('error', 'Proszę podać nowe hasło');
      return;
    }
    
    if (newPassword.length < 6) {
      showMessage('error', 'Nowe hasło musi mieć co najmniej 6 znaków');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showMessage('error', 'Nowe hasła nie są zgodne');
      return;
    }
    
    setChangingPassword(true);
    try {
      await changeUserPassword(currentPassword, newPassword);
      showMessage('success', 'Hasło zostało zmienione!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Failed to change password:', error);
      // Lepsza obsługa błędów
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        showMessage('error', 'Obecne hasło jest nieprawidłowe');
      } else if (error.code === 'auth/too-many-requests') {
        showMessage('error', 'Zbyt wiele nieudanych prób. Spróbuj później.');
      } else if (error.code === 'auth/requires-recent-login') {
        showMessage('error', 'Wymagane ponowne zalogowanie. Wyloguj się i zaloguj ponownie.');
      } else if (error.message) {
        showMessage('error', error.message);
      } else {
        showMessage('error', 'Nie udało się zmienić hasła');
      }
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!currentUser) return;
    
    if (!deletePassword.trim()) {
      showMessage('error', 'Proszę podać hasło aby potwierdzić usunięcie konta');
      return;
    }
    
    setDeleting(true);
    try {
      await deleteUserAccount(deletePassword);
      showMessage('success', 'Konto zostało usunięte');
      setTimeout(() => navigate('/onboarding'), 1500);
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      if (error.code === 'auth/wrong-password') {
        showMessage('error', 'Nieprawidłowe hasło');
      } else {
        showMessage('error', 'Nie udało się usunąć konta');
      }
      setDeleting(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#2a2d35] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#7dd3c0] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2a2d35] text-[#f5f3ed] p-4 pb-24">
      <div className="max-w-md mx-auto">
        {/* Message toast */}
        {message && (
          <div className={`fixed top-4 left-4 right-4 z-50 px-4 py-3 rounded-xl shadow-2xl ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026]' 
              : 'bg-gradient-to-r from-[#e88d8d] to-[#c96b6b] text-white'
          }`}>
            {message.text}
          </div>
        )}

        <header className="flex items-center gap-3 mb-8 pt-4">
          <button
            onClick={() => navigate('/profile')}
            className="w-11 h-11 rounded-2xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center hover:border-[#7dd3c0]/40 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 text-[#7dd3c0]" />
          </button>
          <h1 className="font-medium text-[#f5f3ed]">Edytuj Profil</h1>
        </header>

        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#7dd3c0] to-[#a8d5ba] flex items-center justify-center shadow-2xl shadow-[#7dd3c0]/30 border-4 border-[#2a2d35] overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-medium text-[#1e2026]">{currentUser.initials}</span>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#89cff0] to-[#7dd3c0] flex items-center justify-center shadow-lg border-2 border-[#2a2d35] hover:scale-110 transition-transform duration-300 disabled:opacity-50"
            >
              {uploadingImage ? (
                <Loader2 className="w-5 h-5 text-[#1e2026] animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-[#1e2026]" />
              )}
            </button>
          </div>
          <p className="text-xs text-[#b8b5ad]">
            {avatarUrl ? 'Kliknij aby zmienić zdjęcie' : 'Kliknij aby dodać zdjęcie profilowe'}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Imię i nazwisko *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-4 py-4 text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            />
          </div>

          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Napisz kilka słów o sobie..."
              rows={3}
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-4 py-4 text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300 resize-none"
            />
          </div>

          <div>
            <label className="text-sm text-[#b8b5ad] mb-2 block">Okolica</label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => setNeighborhood(e.target.value)}
              placeholder="Np. Śródmieście, Gdynia"
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#7dd3c0]/20 rounded-2xl px-4 py-4 text-[#f5f3ed] focus:outline-none focus:border-[#7dd3c0]/40 transition-all duration-300"
            />
          </div>
        </div>

        {/* Zmiana hasła */}
        <div className="backdrop-blur-md bg-gradient-to-br from-[rgba(60,65,75,0.5)] to-[rgba(50,55,65,0.3)] border border-[#7dd3c0]/15 rounded-[1.5rem] p-5 mb-6 shadow-xl">
          <h3 className="text-sm font-medium text-[#f5f3ed] mb-4 text-center">Zmień Hasło</h3>

          <div className="space-y-3">
            {/* Obecne hasło */}
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Obecne hasło"
                className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/30 transition-all duration-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7dd3c0] hover:text-[#a8d5ba] transition-colors"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Nowe hasło */}
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nowe hasło (min. 6 znaków)"
                className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/30 transition-all duration-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7dd3c0] hover:text-[#a8d5ba] transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Potwierdź nowe hasło */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Potwierdź nowe hasło"
                className="w-full backdrop-blur-sm bg-[rgba(40,43,50,0.4)] border border-[#7dd3c0]/10 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#7dd3c0]/30 transition-all duration-300 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#7dd3c0] hover:text-[#a8d5ba] transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handlePasswordChange}
              disabled={changingPassword}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#89cff0]/20 to-[#7dd3c0]/20 border border-[#7dd3c0]/40 text-[#7dd3c0] text-sm font-medium hover:scale-105 transition-all duration-300 disabled:opacity-50"
            >
              {changingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
              ) : null}
              Zmień hasło
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-gradient-to-r from-[#7dd3c0] to-[#a8d5ba] text-[#1e2026] font-medium py-4 rounded-2xl hover:shadow-2xl hover:shadow-[#7dd3c0]/30 transition-all duration-300 shadow-xl shadow-[#7dd3c0]/20 mb-4 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {saving && <Loader2 className="w-5 h-5 animate-spin" />}
          {saving ? 'Zapisywanie...' : 'Zapisz Zmiany'}
        </button>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full backdrop-blur-md bg-transparent border-2 border-[#e88d8d]/40 text-[#e88d8d] font-medium py-4 rounded-2xl hover:bg-[rgba(232,141,141,0.1)] hover:border-[#e88d8d]/60 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Usuń konto na zawsze
        </button>

        <p className="text-xs text-center text-[#b8b5ad] mt-4">
          Ta akcja jest nieodwracalna i usunie wszystkie Twoje dane
        </p>
      </div>

      {/* Modal potwierdzenia usunięcia konta */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-[rgba(42,45,53,0.95)] backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[rgba(60,65,75,0.95)] to-[rgba(50,55,65,0.95)] border border-[#e88d8d]/30 rounded-3xl p-6 w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-[#f5f3ed]">Usuń konto na zawsze</h2>
              <button 
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                }}
                className="w-8 h-8 rounded-full bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-[#7dd3c0]" />
              </button>
            </div>
            
            <p className="text-sm text-[#b8b5ad] mb-4">
              Ta akcja jest nieodwracalna. Wszystkie Twoje ogłoszenia, wiadomości i dane zostaną trwale usunięte.
            </p>
            
            <p className="text-sm text-[#e88d8d] mb-3 font-medium">
              Aby potwierdzić, wpisz swoje hasło:
            </p>
            
            <input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Twoje hasło"
              className="w-full backdrop-blur-md bg-[rgba(60,65,75,0.4)] border border-[#e88d8d]/30 rounded-2xl px-4 py-3 text-sm text-[#f5f3ed] placeholder-[#b8b5ad] focus:outline-none focus:border-[#e88d8d]/50 transition-all duration-300 mb-4"
            />
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeletePassword('');
                }}
                className="flex-1 px-4 py-3 rounded-xl backdrop-blur-md bg-[rgba(60,65,75,0.5)] border border-[#7dd3c0]/20 text-[#f5f3ed]"
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#e88d8d] to-[#c96b6b] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? 'Usuwanie...' : 'Usuń'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}