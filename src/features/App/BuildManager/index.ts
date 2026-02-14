import * as Components from './components'
import BuildManager from './BuildManager'

type BuildManagerType = typeof BuildManager;

interface BuildManagerWithComponents extends BuildManagerType {
	Components: typeof Components;
}

const BuildManagerExport = BuildManager as BuildManagerWithComponents;
BuildManagerExport.Components = Components;

export default BuildManagerExport;
