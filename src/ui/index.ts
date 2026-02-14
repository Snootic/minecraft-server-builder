
import * as Components from './components';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SnackbarContainer } from './SnackbarContainer';
import { Header } from './Header';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Loading } from './Loading';
import { Page } from './Page';
import { GlassCard } from './GlassCard';

const BaseUI = {
	LanguageSwitcher,
	SnackbarContainer,
	Header,
	ThemeSwitcher,
	Loading,
	Page,
	GlassCard,
};

type UIType = typeof BaseUI & {
    Components: typeof Components;
};

const UI = BaseUI as UIType;

UI.Components = Components;

export default UI;
