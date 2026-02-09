import VideoController from './VideoController'
import SitemapController from './SitemapController'
import LogController from './LogController'
import Settings from './Settings'
const Controllers = {
    VideoController: Object.assign(VideoController, VideoController),
SitemapController: Object.assign(SitemapController, SitemapController),
LogController: Object.assign(LogController, LogController),
Settings: Object.assign(Settings, Settings),
}

export default Controllers