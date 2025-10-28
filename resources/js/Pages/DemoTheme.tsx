import { useTheme, useThemeClasses, getThemeColors, getStatusColors } from '@/Components/ThemeProvider';
import ThemeToggle from '@/Components/ThemeToggle';

export default function DemoTheme() {
    const { isDarkMode } = useTheme();
    const themeClasses = useThemeClasses();
    const colors = getThemeColors(isDarkMode);
    const statusColors = getStatusColors(isDarkMode);

    return (
        <div className={`p-8 space-y-8 ${themeClasses.bgPrimary} ${themeClasses.textPrimary}`}>
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Sky Theme Demo - Medical Complex</h1>
                <ThemeToggle />
            </div>

            {/* Color Palette Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Sky Theme Colors</h2>
                    <div className="space-y-2">
                        <div className="h-12 rounded bg-primary-500 flex items-center justify-center text-primary-foreground font-medium">
                            Primary Sky Blue
                        </div>
                        <div className="h-12 rounded bg-primary-600 text-white flex items-center justify-center font-medium">
                            Primary Darker
                        </div>
                        <div className="h-12 rounded bg-medical-500 text-white flex items-center justify-center font-medium">
                            Success Green
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Status Indicators</h2>
                    <div className="space-y-2">
                        <span className="status-scheduled inline-block">موعد مجدول</span>
                        <span className="status-completed inline-block">تم الإنجاز</span>
                        <span className="status-cancelled inline-block">ملغي</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Custom Cards</h2>
                    <div className="space-y-2">
                        <div className="card-blue p-4 rounded-lg">
                            <h3 className="font-semibold text-white">Blue Card</h3>
                            <p className="text-white/90 text-sm">Sky blue gradient</p>
                        </div>
                        <div className="card-green p-4 rounded-lg">
                            <h3 className="font-semibold text-white">Green Card</h3>
                            <p className="text-white/90 text-sm">Success gradient</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Theme Variables Demo */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">CSS Custom Properties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card-enhanced p-6">
                        <h3 className="font-semibold mb-4">Current Theme Values</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Background:</span>
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {isDarkMode ? 'hsl(201.3 96.3% 4%)' : 'hsl(0 0% 100%)'}
                                </code>
                            </div>
                            <div className="flex justify-between">
                                <span>Primary:</span>
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {isDarkMode ? 'hsl(198.6 88.7% 55%)' : 'hsl(200.4 98% 39.4%)'}
                                </code>
                            </div>
                            <div className="flex justify-between">
                                <span>Text:</span>
                                <code className="text-xs bg-muted px-2 py-1 rounded">
                                    {isDarkMode ? 'hsl(186.2 83.5% 92%)' : 'hsl(201.3 96.3% 15%)'}
                                </code>
                            </div>
                        </div>
                    </div>

                    <div className="card-enhanced p-6">
                        <h3 className="font-semibold mb-4">Theme Classes</h3>
                        <div className="space-y-2">
                            <button className={themeClasses.buttonPrimary + " px-4 py-2 rounded-md"}>
                                Primary Button
                            </button>
                            <div className={`${themeClasses.bgSecondary} p-4 rounded-lg`}>
                                <p className={themeClasses.textPrimary}>Secondary background</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Colors Demo */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Dynamic Status Colors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <h3 className="font-medium">Scheduled</h3>
                        <div 
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: statusColors.scheduled.bg,
                                color: statusColors.scheduled.text,
                                borderColor: statusColors.scheduled.border
                            }}
                        >
                            Appointment Scheduled<br/>
                            <small>Auto-adapted to theme</small>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-medium">Completed</h3>
                        <div 
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: statusColors.completed.bg,
                                color: statusColors.completed.text,
                                borderColor: statusColors.completed.border
                            }}
                        >
                            Treatment Completed<br/>
                            <small>Success state</small>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-medium">Cancelled</h3>
                        <div 
                            className="p-4 rounded-lg border"
                            style={{
                                backgroundColor: statusColors.cancelled.bg,
                                color: statusColors.cancelled.text,
                                borderColor: statusColors.cancelled.border
                            }}
                        >
                            Appointment Cancelled<br/>
                            <small>Error state</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* RTL Support */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">RTL & Arabic Support</h2>
                <div className="card-enhanced p-6">
                    <div className="text-right" dir="rtl">
                        <h3 className="font-semibold mb-2">نظام الألوان المتكامل للعيادة الطبية</h3>
                        <p className="text-muted-foreground">
                            يدعم النظام الجديد التبديل التلقائي بين الوضع الفاتح والداكن، مع الحفاظ على 
                            التصميم الطبي الاحترافي والألوان المتوافقة مع معايير العيادات الطبية.
                        </p>
                        <div className="mt-4 space-x-2">
                            <span className="status-scheduled">تم الحجز</span>
                            <span className="status-completed">انتهى الكشف</span>
                            <span className="status-cancelled">ملغي</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accessibility Features */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Accessibility & Performance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="card-enhanced p-6">
                        <h3 className="font-semibold mb-4">✨ Features</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                                Auto-detect system preference
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                                Smooth transitions (0.2s)
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                                High contrast ratios
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                                RTL layout support
                            </li>
                        </ul>
                    </div>
                    <div className="card-enhanced p-6">
                        <h3 className="font-semibold mb-4">🎨 Color System</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                                Sky theme primary colors
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                                Medical status colors
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                                Chart visualization colors
                            </li>
                            <li className="flex items-center">
                                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                                Gradient card designs
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}