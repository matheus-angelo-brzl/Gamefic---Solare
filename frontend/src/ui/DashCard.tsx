import React, { CSSProperties } from 'react';
import { tokens } from '../styles/tokens';
import path from 'path/win32';

export const DashIcons = {
    Calendar: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.3333 1.66667V5.00001M6.66667 1.66667V5.00001M2.5 8.33334H17.5M4.16667 3.33334H15.8333C16.7538 3.33334 17.5 4.07953 17.5 5.00001V16.6667C17.5 17.5871 16.7538 18.3333 15.8333 18.3333H4.16667C3.24619 18.3333 2.5 17.5871 2.5 16.6667V5.00001C2.5 4.07953 3.24619 3.33334 4.16667 3.33334Z" stroke="#D98836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
    EyeOff: () => (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.1167 15.1167C13.6922 16.2025 11.9576 16.8041 10.1667 16.8333C4.33333 16.8333 1 10.1667 1 10.1667C2.03657 8.23491 3.47428 6.54717 5.21667 5.21667M8.41667 3.7C8.99028 3.56573 9.57755 3.49862 10.1667 3.5C16 3.5 19.3333 10.1667 19.3333 10.1667C18.8275 11.113 18.2242 12.0039 17.5333 12.825M11.9333 11.9333C11.7045 12.179 11.4285 12.376 11.1218 12.5126C10.8151 12.6492 10.4841 12.7227 10.1484 12.7286C9.81273 12.7346 9.4793 12.6728 9.16801 12.5471C8.85671 12.4213 8.57393 12.2342 8.33654 11.9968C8.09914 11.7594 7.91199 11.4766 7.78626 11.1653C7.66052 10.854 7.59877 10.5206 7.60469 10.1849C7.61062 9.84925 7.68409 9.5182 7.82073 9.21154C7.95737 8.90488 8.15438 8.62887 8.4 8.4M1 1L19.3333 19.3333" stroke="#D98836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
    Clock: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.99996 5.00001V10L13.3333 11.6667M18.3333 10C18.3333 14.6024 14.6023 18.3333 9.99996 18.3333C5.39759 18.3333 1.66663 14.6024 1.66663 10C1.66663 5.39763 5.39759 1.66667 9.99996 1.66667C14.6023 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#D98836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
    CheckSquare: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.5 9.16667L10 11.6667L18.3333 3.33333M17.5 10V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H13.3333" stroke="#D98836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
    Sun: () => (
        <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.1667 1V2.66667M10.1667 17.6667V19.3333M3.68333 3.68333L4.86667 4.86667M15.4667 15.4667L16.65 16.65M1 10.1667H2.66667M17.6667 10.1667H19.3333M3.68333 16.65L4.86667 15.4667M15.4667 4.86667L16.65 3.68333M14.3333 10.1667C14.3333 12.4679 12.4679 14.3333 10.1667 14.3333C7.86548 14.3333 6 12.4679 6 10.1667C6 7.86548 7.86548 6 10.1667 6C12.4679 6 14.3333 7.86548 14.3333 10.1667Z" stroke="#D98836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
    Send: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.3333 1.66666L9.16663 10.8333M9.16663 10.8333L1.66663 7.49999L18.3333 1.66666L12.5 18.3333L9.16663 10.8333Z" stroke="#D98836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
    AlertTriangle: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 7.49999V10.8333M10 14.1667H10.0084M8.57502 3.21665L1.51668 15C1.37116 15.252 1.29416 15.5377 1.29334 15.8288C1.29253 16.1198 1.36793 16.4059 1.51204 16.6588C1.65615 16.9116 1.86396 17.1223 2.11477 17.2699C2.36559 17.4174 2.65068 17.4968 2.94168 17.5H17.0583C17.3494 17.4968 17.6344 17.4174 17.8853 17.2699C18.1361 17.1223 18.3439 16.9116 18.488 16.6588C18.6321 16.4059 18.7075 16.1198 18.7067 15.8288C18.7059 15.5377 18.6289 15.252 18.4834 15L11.425 3.21665C11.2765 2.97174 11.0673 2.76925 10.8177 2.62872C10.5681 2.48819 10.2865 2.41437 10 2.41437C9.71357 2.41437 9.43196 2.48819 9.18235 2.62872C8.93275 2.76925 8.72358 2.97174 8.57502 3.21665Z" stroke="#D98836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
    ThumbsUp: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.83329 9.16666L9.16663 1.66666C9.82967 1.66666 10.4656 1.93005 10.9344 2.39889C11.4032 2.86773 11.6666 3.50362 11.6666 4.16666V7.49999H16.3833C16.6249 7.49725 16.8642 7.54708 17.0846 7.646C17.305 7.74493 17.5013 7.8906 17.6598 8.07292C17.8184 8.25524 17.9354 8.46984 18.0027 8.70187C18.0701 8.93389 18.0862 9.17779 18.05 9.41666L16.9 16.9167C16.8397 17.3141 16.6378 17.6763 16.3315 17.9367C16.0253 18.197 15.6352 18.3379 15.2333 18.3333H5.83329M5.83329 9.16666V18.3333M5.83329 9.16666H3.33329C2.89127 9.16666 2.46734 9.34225 2.15478 9.65481C1.84222 9.96737 1.66663 10.3913 1.66663 10.8333V16.6667C1.66663 17.1087 1.84222 17.5326 2.15478 17.8452C2.46734 18.1577 2.89127 18.3333 3.33329 18.3333H5.83329" stroke="#D98836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
    ThumbsDown: () => (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.1667 10.8333L10.8334 18.3333C10.1703 18.3333 9.53443 18.0699 9.06559 17.6011C8.59675 17.1322 8.33336 16.4964 8.33336 15.8333V12.5H3.61669C3.3751 12.5027 3.13581 12.4529 2.91538 12.354C2.69496 12.255 2.49868 12.1094 2.34014 11.9271C2.18161 11.7447 2.0646 11.5301 1.99724 11.2981C1.92988 11.0661 1.91377 10.8222 1.95003 10.5833L3.10003 3.08332C3.16029 2.6859 3.36216 2.32365 3.66844 2.06331C3.97471 1.80298 4.36475 1.66211 4.76669 1.66665H14.1667M14.1667 10.8333V1.66665M14.1667 10.8333H16.3917C16.8633 10.8417 17.3216 10.6765 17.6795 10.3693C18.0375 10.0621 18.2701 9.6341 18.3334 9.16665V3.33332C18.2701 2.86587 18.0375 2.4379 17.6795 2.13067C17.3216 1.82343 16.8633 1.65831 16.3917 1.66665H14.1667" stroke="#D98836" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
    Pencil: () => (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.3334 2C11.5085 1.8249 11.7163 1.68601 11.9451 1.59125C12.1739 1.49649 12.4191 1.44772 12.6667 1.44772C12.9143 1.44772 13.1595 1.49649 13.3883 1.59125C13.6171 1.68601 13.8249 1.8249 14 2C14.1751 2.1751 14.314 2.38297 14.4088 2.61174C14.5036 2.84051 14.5523 3.08571 14.5523 3.33333C14.5523 3.58096 14.5036 3.82615 14.4088 4.05493C14.314 4.2837 14.1751 4.49157 14 4.66667L5.00004 13.6667L1.33337 14.6667L2.33337 11L11.3334 2Z" stroke="#717171" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    )
};

interface DashCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    style?: CSSProperties;
}

export const DashCard = ({ icon, label, value, style }: DashCardProps) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: tokens.spacing.card,
            backgroundColor: tokens.colors.white,
            borderRadius: tokens.borderRadius.card,
            padding: '8px',
            minWidth: 0,
            width: '100%',
            ...style,
        }}>
            <div style={{
                backgroundColor: tokens.colors.yellow20,
                width: '36px',
                height: '36px',
                borderRadius: tokens.borderRadius.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
            }}>
                <span style={{ 
                    color: tokens.colors.yellow, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    width: '20px',
                    height: '20px',
                }}>
                    {icon}
                </span>
            </div>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '0px',
                overflow: 'hidden',
                flex: 1
            }}>
                <span style={{
                    fontFamily: tokens.typography.fontFamily,
                    fontSize: '10px',
                    fontWeight: tokens.typography.fontWeight.regular,
                    color: tokens.colors.gray[100],
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {label}
                </span>
                <span style={{
                    fontFamily: tokens.typography.fontFamily,
                    fontSize: '16px',
                    fontWeight: tokens.typography.fontWeight.medium,
                    color: tokens.colors.black,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {value}
                </span>
            </div>
        </div>
    );
};
