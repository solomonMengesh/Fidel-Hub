export const formatDuration = (duration) => {
    if (!duration && duration !== 0) return 'N/A';
    if (duration === 0) return '00:00';
    
    if (typeof duration === 'number') {
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      const seconds = Math.floor(duration % 60);
      
      return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');
    }
    
    return duration;
  };
  
  export const calculateTotalDuration = (modules) => {
    if (!modules) return 'N/A';
    
    const totalSeconds = modules.reduce((total, module) => {
      const moduleDuration = module.duration || 0;
      if (typeof moduleDuration === 'string') {
        const [h, m, s] = moduleDuration.split(':').map(Number);
        return total + (h * 3600) + (m * 60) + (s || 0);
      }
      return total + moduleDuration;
    }, 0);
    
    return formatDuration(totalSeconds);
  };
  
  export const calculateProgress = (modules) => {
    if (!modules) return { totalCompleted: 0, total: 0, percentage: 0 };
    
    const totalCompleted = modules.reduce((acc, module) => {
      return acc + (module.lessons?.filter((lesson) => lesson.completed)?.length || 0);
    }, 0);
  
    const total = modules.reduce((acc, module) => {
      return acc + (module.lessons?.length || 0);
    }, 0);
  
    return {
      totalCompleted,
      total,
      percentage: total > 0 ? Math.round((totalCompleted / total) * 100) : 0
    };
  };