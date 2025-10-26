import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import Dropdown from '@/Components/Dropdown';

export default function NotificationDropdown() {
    const { props } = usePage<PageProps>();
    const notifications = props.auth.user.notifications;

    return (
        <div className="ms-3 relative">
            <Dropdown>
                <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                        <button type="button" className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
                            Notifications ({notifications.length})
                        </button>
                    </span>
                </Dropdown.Trigger>

                <Dropdown.Content>
                    {notifications.length > 0 ? (
                        notifications.map(notification => (
                            <Dropdown.Link href={notification.data.link} key={notification.id}>
                                {notification.data.message}
                            </Dropdown.Link>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">No new notifications</div>
                    )}
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}