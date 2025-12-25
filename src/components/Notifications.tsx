"use client";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useGetNotifications } from "@/queries/notifications.queries";
import { useAuthStore } from "@/store/authStore";
import { useNotificationsStore } from "@/store/notificationsStore";
import { supabase } from "@/supabase-client";
import { formatDate } from "@/utils/formatDate";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useCallback } from "react";

const Notifications = () => {
  const { user } = useAuthStore();
  const { setNotifications, selectNotification } = useNotificationsStore();
  const queryClient = useQueryClient();
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const notificationQuery = useGetNotifications();

  // Set up real-time subscription for notifications
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // Invalidate both queries so UI updates immediately
          queryClient.invalidateQueries({
            queryKey: ["notifications"],
          });
          queryClient.refetchQueries({
            queryKey: ["notifications-count", user?.id],
            exact: true,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Flatten all notifications from pages and update store
  useEffect(() => {
    if (notificationQuery.isSuccess && notificationQuery.data) {
      const allNotifications = notificationQuery.data.pages.flatMap(
        (page) => page.notifications
      );
      setNotifications(allNotifications);
    }
  }, [notificationQuery.isSuccess, notificationQuery.data, setNotifications]);

  // Intersection Observer for infinite scroll
  const lastNotificationRef = useCallback(
    (node: HTMLDivElement) => {
      if (notificationQuery.isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && notificationQuery.hasNextPage) {
          notificationQuery.fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [notificationQuery]
  );

  const onOpenNotification = (id: string) => {
    selectNotification(id);
    router.push(`/notification-details?id=${id}`);
  };

  // Get all notifications from pages
  const allNotifications =
    notificationQuery.data?.pages.flatMap((page) => page.notifications) || [];

  const totalCount = notificationQuery.data?.pages[0]?.totalCount || 0;

  return (
    <>
      <HeaderTwo links="home" title="Notifications" />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="section-heading d-flex align-items-center pt-3 justify-content-between rtl-flex-d-row-r">
            <h6>
              Notification(s)
              {totalCount > 0 && (
                <span className="badge bg-primary ms-2">{totalCount}</span>
              )}
            </h6>
          </div>

          <div className="notification-area pb-2">
            {/* Initial Loading State */}
            {notificationQuery.isLoading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading notifications...</p>
              </div>
            )}

            {/* Error State */}
            {notificationQuery.isError && (
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <i className="ti ti-alert-circle me-2"></i>
                <div>
                  <strong>Error:</strong> Failed to load notifications. Please
                  try again.
                </div>
              </div>
            )}

            {/* Empty State */}
            {notificationQuery.isSuccess && allNotifications.length === 0 && (
              <div className="text-center py-5">
                <i className="ti ti-bell-off display-1 text-muted"></i>
                <h5 className="mt-3">No Notifications</h5>
                <p className="text-muted">
                  You don't have any notifications yet.
                </p>
              </div>
            )}

            {/* Notifications List */}
            {notificationQuery.isSuccess && allNotifications.length > 0 && (
              <div className="list-group">
                {allNotifications.map((notification, index) => {
                  const isLastItem = index === allNotifications.length - 1;

                  return (
                    <div
                      key={notification.id}
                      ref={isLastItem ? lastNotificationRef : null}
                      onClick={() => onOpenNotification(notification.id)}
                      className={`list-group-item ${
                        notification.is_read ? "readed" : ""
                      } d-flex align-items-center border-0`}
                      style={{ cursor: "pointer" }}
                    >
                      <span className="noti-icon">
                        <i className="ti ti-bell-ringing"></i>
                      </span>
                      <div className="noti-info">
                        <h6 className="mb-1">{notification.title}</h6>
                        <span>{formatDate(notification.created_at)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Loading More Spinner */}
            {notificationQuery.isFetchingNextPage && (
              <div className="text-center py-4">
                <div
                  className="spinner-border spinner-border-sm text-primary"
                  role="status"
                >
                  <span className="visually-hidden">Loading more...</span>
                </div>
                <p className="mt-2 text-muted small">
                  Loading more notifications...
                </p>
              </div>
            )}

            {/* End of List Message */}
            {notificationQuery.isSuccess &&
              !notificationQuery.hasNextPage &&
              allNotifications.length > 0 && (
                <div className="text-center py-3">
                  <p className="text-muted small">
                    <i className="ti ti-check me-1"></i>
                    You've reached the end of your notifications
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
    </>
  );
};

export default Notifications;
