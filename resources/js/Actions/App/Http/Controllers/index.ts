import VideoController from './VideoController'
import SitemapController from './SitemapController'
import Settings from './Settings'
const Controllers = {
    VideoController: Object.assign(VideoController, VideoController),
SitemapController: Object.assign(SitemapController, SitemapController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers