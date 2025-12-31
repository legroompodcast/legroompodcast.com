const YOUTUBE_CHANNEL_ID = 'UCxrp2coE0vP2lN-QVOZnN8A'; // Leg Room Podcast channel ID

// Function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Function to fetch the latest video using RSS
async function fetchLatestVideoRSS() {
    const container = document.getElementById('latest-video');
    
    try {
        // YouTube RSS feed URL
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
        
        // Using a CORS proxy to fetch the RSS feed
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch RSS feed');
        }
        
        const data = await response.json();
        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, 'text/xml');
        
        // Get the first entry (latest video)
        const entry = xml.querySelector('entry');
        
        if (entry) {
            const videoId = entry.querySelector('videoId').textContent;
            const title = entry.querySelector('title').textContent;
            const publishDate = formatDate(entry.querySelector('published').textContent);
            
            // Update the container with the video
            container.innerHTML = `
                <div class="video-wrapper">
                    <iframe 
                        src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" 
                        allowfullscreen
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    ></iframe>
                </div>
                <div class="episode-info">
                    <h3>${title}</h3>
                    <p class="episode-date">${publishDate}</p>
                </div>
            `;
        } else {
            throw new Error('No videos found in feed');
        }
    } catch (error) {
        console.error('Error fetching latest video:', error);
        
        // Fallback to the playlist if RSS fails
        container.innerHTML = `
            <div class="video-wrapper">
                <iframe 
                    src="https://www.youtube.com/embed/videoseries?list=PL4_yEPaAMft9PqUpuUYDLzofaCJc6Iyjb" 
                    frameborder="0" 
                    allowfullscreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
            </div>
            <div class="episode-info">
                <h3>Season 2</h3>
                <p class="episode-date">Season 2 of the Legroom Podcast</p>
            </div>
        `;
    }
}

// Load the latest video when the page loads
document.addEventListener('DOMContentLoaded', fetchLatestVideoRSS);
